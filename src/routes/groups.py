from flask import Blueprint, request, jsonify
from src.models.user import db, User, Group, GroupMember
from src.routes.auth import verify_token

groups_bp = Blueprint('groups', __name__)

@groups_bp.route('/discover', methods=['GET'])
def discover_groups():
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Get search query if provided
        search_query = request.args.get('search', '').strip()
        
        # Base query for groups
        query = Group.query
        
        # Apply search filter if provided
        if search_query:
            query = query.filter(
                (Group.name.ilike(f'%{search_query}%')) |
                (Group.description.ilike(f'%{search_query}%'))
            )
        
        # Get groups user is not already a member of
        user_group_ids = db.session.query(GroupMember.group_id).filter(
            GroupMember.user_id == user_id
        ).subquery()
        
        groups = query.filter(~Group.id.in_(user_group_ids)).all()
        
        # Convert to dict and add member count
        groups_data = []
        for group in groups:
            group_dict = group.to_dict()
            # Add some mock data for demonstration
            group_dict['icon'] = ['🍕', '✈️', '🎨', '🎮', '📚', '💪', '☕', '🦉'][group.id % 8]
            group_dict['tags'] = ['Community', 'Social', 'Interest']  # Mock tags
            groups_data.append(group_dict)
        
        return jsonify({'groups': groups_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@groups_bp.route('/my', methods=['GET'])
def get_user_groups():
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Get user's group memberships
        memberships = GroupMember.query.filter(
            GroupMember.user_id == user_id
        ).all()
        
        groups_data = []
        for membership in memberships:
            group_dict = membership.group.to_dict()
            group_dict['role'] = membership.role
            group_dict['joined_at'] = membership.joined_at.isoformat() if membership.joined_at else None
            # Add mock data
            group_dict['icon'] = ['🍕', '✈️', '🎨', '🎮', '📚', '💪', '☕', '🦉'][membership.group.id % 8]
            group_dict['unread_messages'] = 0  # Mock data
            group_dict['last_activity'] = '2 hours ago'  # Mock data
            groups_data.append(group_dict)
        
        return jsonify({'groups': groups_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@groups_bp.route('/create', methods=['POST'])
def create_group():
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        data = request.get_json()
        if not data or not data.get('name'):
            return jsonify({'error': 'Group name is required'}), 400
        
        # Create new group
        group = Group(
            name=data['name'],
            description=data.get('description', ''),
            created_by=user_id,
            is_premium_group=data.get('is_premium', False)
        )
        
        db.session.add(group)
        db.session.flush()  # Get the group ID
        
        # Add creator as admin member
        membership = GroupMember(
            group_id=group.id,
            user_id=user_id,
            role='admin'
        )
        
        db.session.add(membership)
        db.session.commit()
        
        return jsonify({
            'message': 'Group created successfully',
            'group': group.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@groups_bp.route('/<int:group_id>/join', methods=['POST'])
def join_group(group_id):
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Check if group exists
        group = Group.query.get(group_id)
        if not group:
            return jsonify({'error': 'Group not found'}), 404
        
        # Check if user is already a member
        existing_membership = GroupMember.query.filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == user_id
        ).first()
        
        if existing_membership:
            return jsonify({'error': 'Already a member of this group'}), 400
        
        # Create membership
        membership = GroupMember(
            group_id=group_id,
            user_id=user_id,
            role='member'
        )
        
        db.session.add(membership)
        db.session.commit()
        
        return jsonify({'message': 'Successfully joined group'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@groups_bp.route('/<int:group_id>/leave', methods=['POST'])
def leave_group(group_id):
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Find membership
        membership = GroupMember.query.filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == user_id
        ).first()
        
        if not membership:
            return jsonify({'error': 'Not a member of this group'}), 400
        
        # Check if user is the only admin
        if membership.role == 'admin':
            admin_count = GroupMember.query.filter(
                GroupMember.group_id == group_id,
                GroupMember.role == 'admin'
            ).count()
            
            if admin_count == 1:
                # Transfer admin to another member or delete group if no other members
                other_members = GroupMember.query.filter(
                    GroupMember.group_id == group_id,
                    GroupMember.user_id != user_id
                ).first()
                
                if other_members:
                    other_members.role = 'admin'
                else:
                    # Delete the group if no other members
                    group = Group.query.get(group_id)
                    db.session.delete(group)
        
        # Remove membership
        db.session.delete(membership)
        db.session.commit()
        
        return jsonify({'message': 'Successfully left group'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@groups_bp.route('/<int:group_id>', methods=['GET'])
def get_group_details(group_id):
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Get group
        group = Group.query.get(group_id)
        if not group:
            return jsonify({'error': 'Group not found'}), 404
        
        # Check if user is a member
        membership = GroupMember.query.filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == user_id
        ).first()
        
        group_dict = group.to_dict()
        group_dict['is_member'] = membership is not None
        group_dict['user_role'] = membership.role if membership else None
        
        # Get member list (basic info)
        members = []
        for member in group.members:
            member_data = {
                'id': member.user.id,
                'username': member.user.username,
                'role': member.role,
                'joined_at': member.joined_at.isoformat() if member.joined_at else None
            }
            members.append(member_data)
        
        group_dict['members'] = members
        
        return jsonify({'group': group_dict}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

