from flask import Blueprint, request, jsonify
from src.models.user import db, User, Profile, Match
from src.routes.auth import verify_token
import json
import random

matching_bp = Blueprint('matching', __name__)

def calculate_match_score(profile1, profile2):
    """Calculate match score between two profiles based on commonalities"""
    if not profile1 or not profile2:
        return 0
    
    total_score = 0
    total_weight = 0
    
    # Define weights for different commonalities
    weights = {
        'personality_traits': 0.25,
        'likes': 0.25,
        'dislikes': 0.20,
        'fears': 0.15,
        'habits': 0.15
    }
    
    for field, weight in weights.items():
        list1 = profile1.get_commonalities_list(field)
        list2 = profile2.get_commonalities_list(field)
        
        if not list1 or not list2:
            continue
        
        # Calculate intersection and union
        intersection = set(item.lower() for item in list1) & set(item.lower() for item in list2)
        union = set(item.lower() for item in list1) | set(item.lower() for item in list2)
        
        if union:
            similarity = len(intersection) / len(union)
            total_score += similarity * weight * 100
            total_weight += weight
    
    # Age compatibility (bonus points for similar ages)
    if profile1.age and profile2.age:
        age_diff = abs(profile1.age - profile2.age)
        if age_diff <= 2:
            age_bonus = 10
        elif age_diff <= 5:
            age_bonus = 5
        elif age_diff <= 10:
            age_bonus = 2
        else:
            age_bonus = 0
        
        total_score += age_bonus
        total_weight += 0.1
    
    # Location compatibility (bonus for same location)
    if profile1.location and profile2.location:
        if profile1.location.lower() == profile2.location.lower():
            total_score += 10
        elif any(word in profile2.location.lower() for word in profile1.location.lower().split()):
            total_score += 5
        total_weight += 0.1
    
    # Normalize score
    if total_weight > 0:
        final_score = min(100, total_score / total_weight * 100)
    else:
        final_score = 0
    
    return round(final_score, 2)

@matching_bp.route('/discover', methods=['GET'])
def discover_matches():
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        user = User.query.get(user_id)
        if not user or not user.profile:
            return jsonify({'error': 'User profile not found'}), 404
        
        if not user.profile.allow_matching:
            return jsonify({'error': 'Matching is disabled for this user'}), 403
        
        # Get all potential matches (users with profiles, excluding self and private profiles)
        potential_matches = User.query.join(Profile).filter(
            User.id != user_id,
            Profile.allow_matching == True,
            Profile.is_private == False
        ).all()
        
        # Get existing matches to avoid duplicates
        existing_matches = db.session.query(Match.user2_id).filter(
            Match.user1_id == user_id
        ).union(
            db.session.query(Match.user1_id).filter(Match.user2_id == user_id)
        ).all()
        existing_match_ids = [match[0] for match in existing_matches]
        
        # Filter out existing matches
        potential_matches = [u for u in potential_matches if u.id not in existing_match_ids]
        
        # Calculate match scores and create match objects
        matches = []
        for potential_user in potential_matches:
            score = calculate_match_score(user.profile, potential_user.profile)
            if score > 50:  # Only include matches with score > 50%
                match_data = {
                    'id': potential_user.id,
                    'name': potential_user.username,
                    'age': potential_user.profile.age,
                    'location': potential_user.profile.location,
                    'bio': potential_user.profile.bio,
                    'match_score': score,
                    'commonalities': {
                        'likes': potential_user.profile.get_commonalities_list('likes'),
                        'dislikes': potential_user.profile.get_commonalities_list('dislikes'),
                        'fears': potential_user.profile.get_commonalities_list('fears'),
                        'traits': potential_user.profile.get_commonalities_list('personality_traits')
                    },
                    'mutual_friends': random.randint(0, 10)  # Mock data for now
                }
                matches.append(match_data)
        
        # Sort by match score (highest first) and limit to top 10
        matches.sort(key=lambda x: x['match_score'], reverse=True)
        matches = matches[:10]
        
        return jsonify({'matches': matches}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@matching_bp.route('/like/<int:target_user_id>', methods=['POST'])
def like_user(target_user_id):
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        if user_id == target_user_id:
            return jsonify({'error': 'Cannot like yourself'}), 400
        
        user = User.query.get(user_id)
        target_user = User.query.get(target_user_id)
        
        if not user or not target_user:
            return jsonify({'error': 'User not found'}), 404
        
        if not user.profile or not target_user.profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        # Check if match already exists
        existing_match = Match.query.filter(
            ((Match.user1_id == user_id) & (Match.user2_id == target_user_id)) |
            ((Match.user1_id == target_user_id) & (Match.user2_id == user_id))
        ).first()
        
        if existing_match:
            return jsonify({'error': 'Match already exists'}), 400
        
        # Calculate match score
        score = calculate_match_score(user.profile, target_user.profile)
        
        # Create match
        match = Match(
            user1_id=user_id,
            user2_id=target_user_id,
            match_score=score,
            status='pending'
        )
        
        db.session.add(match)
        db.session.commit()
        
        # Check if target user has also liked this user (mutual match)
        mutual_match = Match.query.filter(
            Match.user1_id == target_user_id,
            Match.user2_id == user_id
        ).first()
        
        is_mutual = mutual_match is not None
        
        if is_mutual:
            # Update both matches to accepted
            match.status = 'accepted'
            mutual_match.status = 'accepted'
            db.session.commit()
        
        return jsonify({
            'message': 'Like recorded successfully',
            'is_mutual': is_mutual,
            'match_score': score
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@matching_bp.route('/dislike/<int:target_user_id>', methods=['POST'])
def dislike_user(target_user_id):
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        if user_id == target_user_id:
            return jsonify({'error': 'Cannot dislike yourself'}), 400
        
        # Create a rejected match to avoid showing this user again
        existing_match = Match.query.filter(
            ((Match.user1_id == user_id) & (Match.user2_id == target_user_id)) |
            ((Match.user1_id == target_user_id) & (Match.user2_id == user_id))
        ).first()
        
        if not existing_match:
            match = Match(
                user1_id=user_id,
                user2_id=target_user_id,
                match_score=0,
                status='rejected'
            )
            db.session.add(match)
            db.session.commit()
        
        return jsonify({'message': 'Dislike recorded successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@matching_bp.route('/matches', methods=['GET'])
def get_user_matches():
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Get accepted matches for the user
        matches = db.session.query(Match).filter(
            ((Match.user1_id == user_id) | (Match.user2_id == user_id)) &
            (Match.status == 'accepted')
        ).all()
        
        match_list = []
        for match in matches:
            # Get the other user in the match
            other_user_id = match.user2_id if match.user1_id == user_id else match.user1_id
            other_user = User.query.get(other_user_id)
            
            if other_user and other_user.profile:
                match_data = {
                    'match_id': match.id,
                    'user': {
                        'id': other_user.id,
                        'username': other_user.username,
                        'age': other_user.profile.age,
                        'location': other_user.profile.location,
                        'bio': other_user.profile.bio
                    },
                    'match_score': match.match_score,
                    'matched_at': match.matched_at.isoformat() if match.matched_at else None
                }
                match_list.append(match_data)
        
        return jsonify({'matches': match_list}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

