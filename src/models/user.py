from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_premium = db.Column(db.Boolean, default=False)
    
    # Relationships
    profile = db.relationship('Profile', backref='user', uselist=False, cascade='all, delete-orphan')
    sent_matches = db.relationship('Match', foreign_keys='Match.user1_id', backref='user1', cascade='all, delete-orphan')
    received_matches = db.relationship('Match', foreign_keys='Match.user2_id', backref='user2', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_premium': self.is_premium,
            'hasCompletedProfile': self.profile is not None
        }

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    age = db.Column(db.Integer)
    location = db.Column(db.String(100))
    bio = db.Column(db.Text)
    profile_picture_url = db.Column(db.String(255))
    
    # Commonalities stored as JSON
    personality_traits = db.Column(db.Text)  # JSON array
    likes = db.Column(db.Text)  # JSON array
    dislikes = db.Column(db.Text)  # JSON array
    fears = db.Column(db.Text)  # JSON array
    habits = db.Column(db.Text)  # JSON array
    
    # Privacy settings
    is_private = db.Column(db.Boolean, default=False)
    allow_matching = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Profile {self.user.username}>'

    def get_commonalities_list(self, field_name):
        """Helper method to get commonalities as a list"""
        field_value = getattr(self, field_name)
        if field_value:
            try:
                return json.loads(field_value)
            except json.JSONDecodeError:
                return []
        return []

    def set_commonalities_list(self, field_name, value_list):
        """Helper method to set commonalities from a list"""
        setattr(self, field_name, json.dumps(value_list) if value_list else None)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'age': self.age,
            'location': self.location,
            'bio': self.bio,
            'profile_picture_url': self.profile_picture_url,
            'personality_traits': self.get_commonalities_list('personality_traits'),
            'likes': self.get_commonalities_list('likes'),
            'dislikes': self.get_commonalities_list('dislikes'),
            'fears': self.get_commonalities_list('fears'),
            'habits': self.get_commonalities_list('habits'),
            'is_private': self.is_private,
            'allow_matching': self.allow_matching,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    match_score = db.Column(db.Float, nullable=False)
    matched_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, rejected
    
    # Ensure unique matches
    __table_args__ = (db.UniqueConstraint('user1_id', 'user2_id', name='unique_match'),)

    def __repr__(self):
        return f'<Match {self.user1_id}-{self.user2_id} ({self.match_score}%)>'

    def to_dict(self):
        return {
            'id': self.id,
            'user1_id': self.user1_id,
            'user2_id': self.user2_id,
            'match_score': self.match_score,
            'matched_at': self.matched_at.isoformat() if self.matched_at else None,
            'status': self.status
        }

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_premium_group = db.Column(db.Boolean, default=False)
    
    # Relationships
    creator = db.relationship('User', backref='created_groups')
    members = db.relationship('GroupMember', backref='group', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Group {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_premium_group': self.is_premium_group,
            'member_count': len(self.members)
        }

class GroupMember(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    role = db.Column(db.String(20), default='member')  # admin, member
    
    # Relationships
    user = db.relationship('User', backref='group_memberships')
    
    # Ensure unique memberships
    __table_args__ = (db.UniqueConstraint('group_id', 'user_id', name='unique_membership'),)

    def __repr__(self):
        return f'<GroupMember {self.user.username} in {self.group.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'group_id': self.group_id,
            'user_id': self.user_id,
            'joined_at': self.joined_at.isoformat() if self.joined_at else None,
            'role': self.role
        }

