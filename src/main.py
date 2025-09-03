import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.matching import matching_bp
from src.routes.groups import groups_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'sames_secret_key_2024'

# Enable CORS for all routes
CORS(app, origins="*")

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(matching_bp, url_prefix='/api/matching')
app.register_blueprint(groups_bp, url_prefix='/api/groups')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()
    
    # Create some sample data if database is empty
    from src.models.user import User, Profile, Group
    if User.query.count() == 0:
        # Create sample users with profiles
        from werkzeug.security import generate_password_hash
        sample_users = [
            {
                'username': 'alex_k',
                'email': 'alex@example.com',
                'password_hash': generate_password_hash('password123'),
                'profile': {
                    'age': 28,
                    'location': 'New York, USA',
                    'bio': 'Creative soul who loves art, technology, and deep conversations.',
                    'personality_traits': ['Creative', 'Introverted', 'Curious'],
                    'likes': ['Art', 'Technology', 'Coffee', 'Reading'],
                    'dislikes': ['Crowds', 'Small talk'],
                    'fears': ['Heights', 'Public speaking'],
                    'habits': ['Morning coffee', 'Late night coding']
                }
            },
            {
                'username': 'sarah_m',
                'email': 'sarah@example.com',
                'password_hash': generate_password_hash('password123'),
                'profile': {
                    'age': 25,
                    'location': 'Brooklyn, NY',
                    'bio': 'Book lover and coffee enthusiast.',
                    'personality_traits': ['Thoughtful', 'Empathetic', 'Quiet'],
                    'likes': ['Books', 'Coffee', 'Philosophy', 'Cats'],
                    'dislikes': ['Loud music', 'Parties'],
                    'fears': ['Spiders', 'Failure'],
                    'habits': ['Daily reading', 'Meditation']
                }
            },
            {
                'username': 'mike_r',
                'email': 'mike@example.com',
                'password_hash': generate_password_hash('password123'),
                'profile': {
                    'age': 30,
                    'location': 'Manhattan, NY',
                    'bio': 'Gaming enthusiast and music producer.',
                    'personality_traits': ['Creative', 'Night owl', 'Passionate'],
                    'likes': ['Gaming', 'Music Production', 'Pizza', 'Late nights'],
                    'dislikes': ['Early mornings', 'Formal events'],
                    'fears': ['Commitment', 'Losing creativity'],
                    'habits': ['Gaming sessions', 'Music creation']
                }
            }
        ]
        
        for user_data in sample_users:
            user = User(
                username=user_data['username'],
                email=user_data['email'],
                password_hash=user_data['password_hash']
            )
            db.session.add(user)
            db.session.flush()
            
            profile_data = user_data['profile']
            profile = Profile(
                user_id=user.id,
                age=profile_data['age'],
                location=profile_data['location'],
                bio=profile_data['bio']
            )
            
            # Set commonalities
            import json
            profile.personality_traits = json.dumps(profile_data['personality_traits'])
            profile.likes = json.dumps(profile_data['likes'])
            profile.dislikes = json.dumps(profile_data['dislikes'])
            profile.fears = json.dumps(profile_data['fears'])
            profile.habits = json.dumps(profile_data['habits'])
            
            db.session.add(profile)
        
        # Create sample groups
        sample_groups = [
            {'name': 'Foodies Unite', 'description': 'Share your culinary adventures and discoveries', 'created_by': 1},
            {'name': 'Travel Buddies', 'description': 'Find travel companions and share experiences', 'created_by': 1},
            {'name': 'Local Artists', 'description': 'Connect with creative minds in your area', 'created_by': 2},
            {'name': 'Gamers Guild', 'description': 'Level up together in your favorite games', 'created_by': 3},
            {'name': 'Bookworms', 'description': 'Discuss literature and share recommendations', 'created_by': 2},
            {'name': 'Coffee Connoisseurs', 'description': 'Discussing the perfect brew', 'created_by': 1},
            {'name': 'Night Owls', 'description': 'For those who come alive after midnight', 'created_by': 3}
        ]
        
        for group_data in sample_groups:
            group = Group(
                name=group_data['name'],
                description=group_data['description'],
                created_by=group_data['created_by']
            )
            db.session.add(group)
        
        db.session.commit()
        print("Sample data created successfully!")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
