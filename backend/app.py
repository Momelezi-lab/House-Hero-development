from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json
from sqlalchemy import func
from datetime import datetime, timedelta
from decimal import Decimal

app = Flask(__name__)

# Production configuration
if os.environ.get('DATABASE_URL'):
    # For production (Render, Heroku, etc.)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL').replace('postgres://', 'postgresql://')
else:
    # For local development
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Email configuration
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', '')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', '')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@homeswift.com')
app.config['ADMIN_EMAIL'] = os.environ.get('ADMIN_EMAIL', 'admin@homeswift.com')
app.config['ADMIN_PHONE'] = os.environ.get('ADMIN_PHONE', '+27 11 123 4567')

mail = Mail(app)

# CORS configuration for production
CORS(app, 
     origins=[
         "https://house-hero.netlify.app",           # Your Netlify frontend
         "https://house-hero-backend.onrender.com",  # Your Render backend
         "http://localhost:3000",                    # Local development
         "http://127.0.0.1:3000",                    # Local development (alternative)
         "http://localhost:5000",                    # Local development
         "http://127.0.0.1:5000",                   # Local development
         "http://localhost:5001",                    # Local development
         "http://127.0.0.1:5001",                   # Local development
         "file://",                                  # File protocol (for direct HTML file access)
         "*"                                         # Allow all origins in development (remove in production)
     ],
     methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True
)

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(30), nullable=True)
    registered = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'registered': self.registered
        }

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    service = db.Column(db.String(100), nullable=False)
    details = db.Column(db.String(500))
    status = db.Column(db.String(50), default='pending')
    amount = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'date': self.date,
            'time': self.time,
            'service': self.service,
            'details': self.details,
            'status': self.status,
            'amount': self.amount
        }

class Complaint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    type = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    status = db.Column(db.String(50), default='pending')
    date = db.Column(db.String(20), nullable=False)
    # New fields
    service_provider = db.Column(db.String(255), nullable=True)
    desired_resolution = db.Column(db.String(100), nullable=True)
    contact_preference = db.Column(db.String(50), nullable=True)
    urgency_level = db.Column(db.String(50), nullable=True)
    service_date = db.Column(db.String(20), nullable=True)
    is_anonymous = db.Column(db.Boolean, default=False)
    follow_up_enabled = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'type': self.type,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'date': self.date,
            'service_provider': self.service_provider,
            'desired_resolution': self.desired_resolution,
            'contact_preference': self.contact_preference,
            'urgency_level': self.urgency_level,
            'service_date': self.service_date,
            'is_anonymous': self.is_anonymous,
            'follow_up_enabled': self.follow_up_enabled,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class ServiceProvider(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    service_type = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(255), nullable=True)
    experience_years = db.Column(db.Integer, default=0)
    hourly_rate = db.Column(db.Float, default=0.0)
    rating = db.Column(db.Float, default=0.0)
    total_bookings = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default='active')
    registered = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'service_type': self.service_type,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'experience_years': self.experience_years,
            'hourly_rate': self.hourly_rate,
            'rating': self.rating,
            'total_bookings': self.total_bookings,
            'status': self.status,
            'registered': self.registered,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# New models for dynamic pricing system
class ServicePricing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_category = db.Column(db.String(200), nullable=False)
    service_type = db.Column(db.String(200), nullable=False)
    item_description = db.Column(db.String(500))
    provider_base_price = db.Column(db.Numeric(10, 2), nullable=False)
    customer_display_price = db.Column(db.Numeric(10, 2), nullable=False)
    color_surcharge_provider = db.Column(db.Numeric(10, 2), default=0)
    color_surcharge_customer = db.Column(db.Numeric(10, 2), default=0)
    is_white_applicable = db.Column(db.Boolean, default=False)
    commission_percentage = db.Column(db.Numeric(5, 2), default=10)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'service_category': self.service_category,
            'service_type': self.service_type,
            'item_description': self.item_description,
            'provider_base_price': float(self.provider_base_price),
            'customer_display_price': float(self.customer_display_price),
            'color_surcharge_provider': float(self.color_surcharge_provider),
            'color_surcharge_customer': float(self.color_surcharge_customer),
            'is_white_applicable': self.is_white_applicable,
            'commission_percentage': float(self.commission_percentage)
        }

class Customer(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(120), nullable=False)
    customer_email = db.Column(db.String(120), nullable=False)
    customer_phone = db.Column(db.String(30), nullable=False)
    saved_addresses = db.Column(db.Text)  # JSON string
    total_bookings = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'customer_id': self.customer_id,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'saved_addresses': json.loads(self.saved_addresses) if self.saved_addresses else [],
            'total_bookings': self.total_bookings,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class ServiceRequest(db.Model):
    request_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.customer_id'), nullable=True)
    customer_name = db.Column(db.String(120), nullable=False)
    customer_email = db.Column(db.String(120), nullable=False)
    customer_phone = db.Column(db.String(30), nullable=False)
    customer_address = db.Column(db.String(500), nullable=False)
    unit_number = db.Column(db.String(50))
    complex_name = db.Column(db.String(200))
    access_instructions = db.Column(db.Text)
    preferred_date = db.Column(db.Date, nullable=False)
    preferred_time = db.Column(db.Time, nullable=False)
    additional_notes = db.Column(db.Text)
    selected_items = db.Column(db.Text)  # JSON string
    total_customer_paid = db.Column(db.Numeric(12, 2))
    total_provider_payout = db.Column(db.Numeric(12, 2))
    total_commission_earned = db.Column(db.Numeric(12, 2))
    status = db.Column(db.String(50), default='pending')
    priority = db.Column(db.String(20), default='medium')
    assigned_provider_id = db.Column(db.Integer, db.ForeignKey('service_provider.id'), nullable=True)
    provider_name = db.Column(db.String(120))
    provider_phone = db.Column(db.String(30))
    provider_email = db.Column(db.String(120))
    payment_method = db.Column(db.String(20))
    customer_payment_received = db.Column(db.Boolean, default=False)
    provider_payment_made = db.Column(db.Boolean, default=False)
    commission_collected = db.Column(db.Boolean, default=False)
    admin_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    confirmed_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    reminder_sent_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'request_id': self.request_id,
            'customer_id': self.customer_id,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'customer_address': self.customer_address,
            'unit_number': self.unit_number,
            'complex_name': self.complex_name,
            'access_instructions': self.access_instructions,
            'preferred_date': self.preferred_date.isoformat() if self.preferred_date else None,
            'preferred_time': self.preferred_time.strftime('%H:%M') if self.preferred_time else None,
            'additional_notes': self.additional_notes,
            'selected_items': json.loads(self.selected_items) if self.selected_items else [],
            'total_customer_paid': float(self.total_customer_paid) if self.total_customer_paid else 0,
            'total_provider_payout': float(self.total_provider_payout) if self.total_provider_payout else 0,
            'total_commission_earned': float(self.total_commission_earned) if self.total_commission_earned else 0,
            'status': self.status,
            'priority': self.priority,
            'assigned_provider_id': self.assigned_provider_id,
            'provider_name': self.provider_name,
            'provider_phone': self.provider_phone,
            'provider_email': self.provider_email,
            'payment_method': self.payment_method,
            'customer_payment_received': self.customer_payment_received,
            'provider_payment_made': self.provider_payment_made,
            'commission_collected': self.commission_collected,
            'admin_notes': self.admin_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'confirmed_at': self.confirmed_at.isoformat() if self.confirmed_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'message': 'House Hero Backend is running!'})

@app.route('/')
def home():
    return jsonify({'message': 'House Hero Backend API', 'status': 'running'})

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    registered = datetime.now().strftime('%Y-%m-%d')
    if not name or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409
    password_hash = generate_password_hash(password)
    user = User(name=name, email=email, password_hash=password_hash, phone=phone, registered=registered)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully', 'user': user.to_dict()}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Login successful', 'user': user.to_dict()})
    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    # Improved duplicate check: case-insensitive, trimmed
    existing = Booking.query.filter(
        func.lower(func.trim(Booking.name)) == data.get('name', '').strip().lower(),
        Booking.date == data.get('date'),
        Booking.time == data.get('time'),
        func.lower(func.trim(Booking.service)) == data.get('service', '').strip().lower()
    ).first()
    if existing:
        return jsonify({'error': 'Duplicate booking detected'}), 409
    booking = Booking(
        name=data.get('name'),
        address=data.get('address'),
        date=data.get('date'),
        time=data.get('time'),
        service=data.get('service'),
        details=data.get('details'),
        status=data.get('status', 'pending'),
        amount=float(data.get('amount', 0.0))
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify({'message': 'Booking created', 'booking': booking.to_dict()}), 201

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    bookings = Booking.query.all()
    return jsonify([b.to_dict() for b in bookings])

@app.route('/api/bookings/<int:booking_id>', methods=['PATCH'])
def update_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    data = request.get_json()
    if 'status' in data:
        booking.status = data['status']
    db.session.commit()
    return jsonify({'message': 'Booking updated', 'booking': booking.to_dict()})

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    db.session.delete(booking)
    db.session.commit()
    return jsonify({'message': 'Booking deleted'})

@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'type', 'title', 'description', 'date']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    complaint = Complaint(
        name=data.get('name'),
        email=data.get('email'),
        type=data.get('type'),
        title=data.get('title'),
        description=data.get('description'),
        status=data.get('status', 'pending'),
        date=data.get('date'),
        service_provider=data.get('serviceProvider'),
        desired_resolution=data.get('desiredResolution'),
        contact_preference=data.get('contactPreference'),
        urgency_level=data.get('urgencyLevel'),
        service_date=data.get('serviceDate'),
        is_anonymous=data.get('anonymous', False),
        follow_up_enabled=data.get('followUp', True)
    )
    db.session.add(complaint)
    db.session.commit()
    return jsonify({'message': 'Complaint created', 'complaint': complaint.to_dict()}), 201

@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    complaints = Complaint.query.all()
    return jsonify([c.to_dict() for c in complaints])

@app.route('/api/complaints/<int:complaint_id>', methods=['PATCH'])
def update_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    data = request.get_json()
    
    # Update fields if provided
    updateable_fields = [
        'status', 'service_provider', 'desired_resolution', 'contact_preference',
        'urgency_level', 'service_date', 'is_anonymous', 'follow_up_enabled',
        'title', 'description', 'type'
    ]
    
    for field in updateable_fields:
        if field in data:
            setattr(complaint, field, data[field])
    
    # Update the updated_at timestamp
    complaint.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'message': 'Complaint updated', 'complaint': complaint.to_dict()})

@app.route('/api/complaints/<int:complaint_id>', methods=['GET'])
def get_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    return jsonify(complaint.to_dict())

@app.route('/api/complaints/<int:complaint_id>', methods=['DELETE'])
def delete_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    db.session.delete(complaint)
    db.session.commit()
    return jsonify({'message': 'Complaint deleted'})

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@app.route('/api/users/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    # Update fields if provided
    updateable_fields = ['name', 'email', 'phone']
    
    for field in updateable_fields:
        if field in data and data[field] is not None:
            setattr(user, field, data[field])
    
    db.session.commit()
    return jsonify({'message': 'User updated', 'user': user.to_dict()})

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})

@app.route('/api/providers', methods=['POST'])
def create_provider():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'service_type', 'phone', 'email']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Check if email already exists
    if ServiceProvider.query.filter_by(email=data.get('email')).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    provider = ServiceProvider(
        name=data.get('name'),
        service_type=data.get('service_type'),
        phone=data.get('phone'),
        email=data.get('email'),
        address=data.get('address'),
        experience_years=data.get('experience_years', 0),
        hourly_rate=float(data.get('hourly_rate', 0.0)),
        rating=float(data.get('rating', 0.0)),
        total_bookings=data.get('total_bookings', 0),
        status=data.get('status', 'active'),
        registered=datetime.now().strftime('%Y-%m-%d')
    )
    db.session.add(provider)
    db.session.commit()
    return jsonify({'message': 'Provider created', 'provider': provider.to_dict()}), 201

@app.route('/api/providers', methods=['GET'])
def get_providers():
    providers = ServiceProvider.query.all()
    return jsonify([p.to_dict() for p in providers])

@app.route('/api/providers/<int:provider_id>', methods=['GET'])
def get_provider(provider_id):
    """Get a specific provider by ID"""
    provider = ServiceProvider.query.get_or_404(provider_id)
    return jsonify(provider.to_dict())

@app.route('/api/providers/<int:provider_id>', methods=['PATCH'])
def update_provider(provider_id):
    provider = ServiceProvider.query.get_or_404(provider_id)
    data = request.get_json()
    
    # Update fields if provided
    updateable_fields = [
        'name', 'service_type', 'phone', 'email', 'address', 
        'experience_years', 'hourly_rate', 'rating', 'total_bookings', 'status'
    ]
    
    for field in updateable_fields:
        if field in data and data[field] is not None:
            if field in ['experience_years', 'total_bookings']:
                setattr(provider, field, int(data[field]))
            elif field in ['hourly_rate', 'rating']:
                setattr(provider, field, float(data[field]))
            else:
                setattr(provider, field, data[field])
    
    # Update the updated_at timestamp
    provider.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'message': 'Provider updated', 'provider': provider.to_dict()})

@app.route('/api/providers/<int:provider_id>', methods=['DELETE'])
def delete_provider(provider_id):
    provider = ServiceProvider.query.get_or_404(provider_id)
    db.session.delete(provider)
    db.session.commit()
    return jsonify({'message': 'Provider deleted'})

# ========== DYNAMIC PRICING SYSTEM ENDPOINTS ==========

# Email helper functions
def send_email(to, subject, body):
    """Send email using Flask-Mail"""
    try:
        msg = Message(subject, recipients=[to], body=body)
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

def format_currency(amount):
    """Format amount as South African Rand"""
    return f"R{amount:,.2f}".replace(',', ' ')

# Pricing endpoints
@app.route('/api/pricing/categories', methods=['GET'])
def get_categories():
    """Get all unique service categories"""
    categories = db.session.query(ServicePricing.service_category).distinct().all()
    return jsonify([cat[0] for cat in categories])

@app.route('/api/pricing', methods=['GET'])
def get_pricing():
    """Get pricing by category"""
    category = request.args.get('category')
    if not category:
        return jsonify({'error': 'Category parameter required'}), 400
    
    pricing_items = ServicePricing.query.filter_by(service_category=category).all()
    return jsonify([item.to_dict() for item in pricing_items])

@app.route('/api/pricing/all', methods=['GET'])
def get_all_pricing():
    """Get all pricing items"""
    pricing_items = ServicePricing.query.all()
    return jsonify([item.to_dict() for item in pricing_items])

# Service Request endpoints
@app.route('/api/service-requests', methods=['POST'])
def create_service_request():
    """Create a new service request with backend calculations"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['customer_name', 'customer_email', 'customer_phone', 
                         'customer_address', 'preferred_date', 'preferred_time', 'items']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate phone (10 digits for South Africa)
        phone = data.get('customer_phone', '').replace(' ', '').replace('-', '').replace('+27', '0')
        if len(phone) != 10 or not phone.isdigit():
            return jsonify({'error': 'Phone number must be exactly 10 digits'}), 400
        
        # Validate date (cannot be in the past)
        preferred_date = datetime.strptime(data.get('preferred_date'), '%Y-%m-%d').date()
        if preferred_date < datetime.now().date():
            return jsonify({'error': 'Preferred date cannot be in the past'}), 400
        
        # Start transaction
        total_customer_paid = Decimal('0')
        total_provider_payout = Decimal('0')
        total_commission_earned = Decimal('0')
        selected_items_array = []
        
        # Callout fee constant (R100 - charged to customer only, not part of provider payout)
        CALLOUT_FEE = Decimal('100.00')
        
        # Process each item
        for item_input in data.get('items', []):
            category = item_input.get('category')
            service_type = item_input.get('type')
            quantity = int(item_input.get('quantity', 1))
            is_white = item_input.get('is_white', False)
            
            if quantity < 1 or quantity > 10:
                return jsonify({'error': 'Quantity must be between 1 and 10'}), 400
            
            # Get pricing from database (server-side validation)
            pricing = ServicePricing.query.filter_by(
                service_category=category,
                service_type=service_type
            ).first()
            
            if not pricing:
                return jsonify({'error': f'Pricing not found for {category} - {service_type}'}), 404
            
            # Calculate prices
            customer_line_price = Decimal(str(pricing.customer_display_price))
            provider_line_price = Decimal(str(pricing.provider_base_price))
            
            if is_white and pricing.is_white_applicable:
                customer_line_price += Decimal(str(pricing.color_surcharge_customer))
                provider_line_price += Decimal(str(pricing.color_surcharge_provider))
            
            item_price_customer = customer_line_price * quantity
            item_price_provider = provider_line_price * quantity
            item_commission = item_price_customer - item_price_provider
            
            total_customer_paid += item_price_customer
            total_provider_payout += item_price_provider
            total_commission_earned += item_commission
            
            selected_items_array.append({
                'category': pricing.service_category,
                'type': pricing.service_type,
                'is_white': is_white,
                'quantity': quantity,
                'customer_price': float(item_price_customer),
                'provider_price': float(item_price_provider),
                'commission': float(item_commission)
            })
        
        # Add callout fee to customer total (NOT to provider payout - it's a HomeSwift fee)
        # The callout fee is 100% commission for HomeSwift
        total_customer_paid += CALLOUT_FEE
        total_commission_earned += CALLOUT_FEE
        
        # Create or find customer
        customer = Customer.query.filter_by(customer_email=data.get('customer_email')).first()
        if not customer:
            customer = Customer(
                customer_name=data.get('customer_name'),
                customer_email=data.get('customer_email'),
                customer_phone=phone
            )
            db.session.add(customer)
            db.session.flush()
        else:
            customer.total_bookings += 1
        
        # Create service request
        preferred_time_obj = datetime.strptime(data.get('preferred_time'), '%H:%M').time()
        
        service_request = ServiceRequest(
            customer_id=customer.customer_id,
            customer_name=data.get('customer_name'),
            customer_email=data.get('customer_email'),
            customer_phone=phone,
            customer_address=data.get('customer_address'),
            unit_number=data.get('unit_number'),
            complex_name=data.get('complex_name'),
            access_instructions=data.get('access_instructions'),
            preferred_date=preferred_date,
            preferred_time=preferred_time_obj,
            additional_notes=data.get('additional_notes'),
            selected_items=json.dumps(selected_items_array),
            total_customer_paid=total_customer_paid,
            total_provider_payout=total_provider_payout,
            total_commission_earned=total_commission_earned,
            status='pending'
        )
        
        db.session.add(service_request)
        db.session.commit()
        
        # Send emails
        send_booking_confirmation_email(service_request)
        send_admin_alert_email(service_request)
        
        return jsonify({
            'message': 'Service request created successfully',
            'request_id': service_request.request_id,
            'total_customer_paid': float(total_customer_paid)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def send_booking_confirmation_email(request):
    """Email 1: Customer confirmation - New service request received"""
    items = json.loads(request.selected_items)
    service_type = items[0].get('category', 'Cleaning Service') if items else 'Cleaning Service'
    cleaning_type = items[0].get('type', '') if items else ''
    
    body = f"""Hi {request.customer_name},

Thank you for booking with HomeSwift!

Your Request Details:
- Service Type: {service_type}
- Date: {request.preferred_date}
- Location: {request.customer_address}
- Status: Pending Confirmation

We're finding the best provider for you and will confirm within 2 hours.

Request ID: {request.request_id}

Questions? Reply to this email.

- HomeSwift Team"""
    
    send_email(request.customer_email, f"Your service request has been received - HomeSwift", body)

def send_admin_alert_email(request):
    """Email 2: Admin alert - New booking received"""
    items = json.loads(request.selected_items)
    service_type = items[0].get('category', 'Cleaning Service') if items else 'Cleaning Service'
    cleaning_type = items[0].get('type', '') if items else ''
    items_text = ""
    for item in items:
        white_text = " (White)" if item.get('is_white') else ""
        items_text += f"• {item.get('type')}{white_text} × {item.get('quantity')}\n"
    
    body = f"""New service request received!

Customer: {request.customer_name}
Phone: {request.customer_phone}
Email: {request.customer_email}
Service: {service_type} - {cleaning_type}
Date: {request.preferred_date}
Time: {request.preferred_time.strftime('%I:%M %p')}
Address: {request.customer_address}
{f'Unit: {request.unit_number}' if request.unit_number else ''}
{f'Complex: {request.complex_name}' if request.complex_name else ''}
Description: {request.additional_notes or 'No additional notes'}
Priority: {request.priority or 'Medium'}

Items Requested:
{items_text}

Request ID: {request.request_id}

ACTION REQUIRED: Assign a provider and confirm booking."""
    
    send_email(app.config['ADMIN_EMAIL'], f"NEW BOOKING: {service_type} - {request.customer_address.split(',')[0] if request.customer_address else 'Location'}", body)

@app.route('/api/service-requests', methods=['GET'])
def get_service_requests():
    """Get all service requests (admin)"""
    status_filter = request.args.get('status')
    category_filter = request.args.get('category')
    search = request.args.get('search')
    
    query = ServiceRequest.query
    
    if status_filter:
        query = query.filter_by(status=status_filter)
    if category_filter:
        query = query.filter(ServiceRequest.selected_items.contains(category_filter))
    if search:
        query = query.filter(
            (ServiceRequest.customer_name.contains(search)) |
            (ServiceRequest.request_id == search)
        )
    
    requests = query.order_by(ServiceRequest.created_at.desc()).all()
    return jsonify([req.to_dict() for req in requests])

@app.route('/api/service-requests/<int:request_id>', methods=['GET'])
def get_service_request(request_id):
    """Get a specific service request"""
    request_obj = ServiceRequest.query.get_or_404(request_id)
    return jsonify(request_obj.to_dict())

@app.route('/api/service-requests/<int:request_id>', methods=['PATCH'])
def update_service_request(request_id):
    """Update a service request (admin)"""
    request_obj = ServiceRequest.query.get_or_404(request_id)
    data = request.get_json()
    
    updateable_fields = [
        'status', 'priority', 'assigned_provider_id', 'provider_name',
        'provider_phone', 'provider_email', 'payment_method',
        'customer_payment_received', 'provider_payment_made',
        'commission_collected', 'admin_notes'
    ]
    
    for field in updateable_fields:
        if field in data:
            setattr(request_obj, field, data[field])
    
    # Handle status changes
    if 'status' in data:
        if data['status'] == 'confirmed' and not request_obj.confirmed_at:
            request_obj.confirmed_at = datetime.utcnow()
            # Send provider assignment emails
            if request_obj.assigned_provider_id:
                send_provider_assignment_email(request_obj)
                send_customer_provider_confirmed_email(request_obj)
        elif data['status'] == 'in_progress' and request_obj.status != 'in_progress':
            send_in_progress_email(request_obj)
        elif data['status'] == 'completed' and not request_obj.completed_at:
            request_obj.completed_at = datetime.utcnow()
            send_completion_email(request_obj)
            send_admin_completion_email(request_obj)
    
    request_obj.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Service request updated', 'request': request_obj.to_dict()})

def send_provider_assignment_email(request):
    """Email 3: Provider assignment - When status changes to Confirmed"""
    if not request.provider_email:
        return
    
    items = json.loads(request.selected_items)
    service_type = items[0].get('category', 'Cleaning Service') if items else 'Cleaning Service'
    cleaning_type = items[0].get('type', '') if items else ''
    items_text = ""
    for item in items:
        white_text = " (White)" if item.get('is_white') else ""
        items_text += f"• {item.get('type')}{white_text} × {item.get('quantity')}\n"
    
    # Create Google Maps link
    maps_link = f"https://www.google.com/maps/search/?api=1&query={request.customer_address.replace(' ', '+')}"
    
    body = f"""Hi {request.provider_name},

You have a new job assignment!

Job Details:
- Service: {service_type} - {cleaning_type}
- Date: {request.preferred_date}
- Time: {request.preferred_time.strftime('%I:%M %p')}
- Location: {request.customer_address} ({maps_link})
{f'Unit: {request.unit_number}' if request.unit_number else ''}
{f'Complex: {request.complex_name}' if request.complex_name else ''}
- Customer: {request.customer_name} - {request.customer_phone}

Job Description:
{request.additional_notes or 'Standard cleaning service'}

Priority: {request.priority or 'Medium'}

PLEASE CONFIRM:
Reply to this email or call {app.config['ADMIN_PHONE']} to confirm you can take this job.

Customer expects you at {request.preferred_time.strftime('%I:%M %p')} on {request.preferred_date}.

Job ID: {request.request_id}"""
    
    send_email(request.provider_email, f"New Job Assignment - HomeSwift - {request.preferred_date}", body)

def send_customer_provider_confirmed_email(request):
    """Email 4: Customer confirmation - When provider is assigned"""
    items = json.loads(request.selected_items)
    service_type = items[0].get('category', 'Cleaning Service') if items else 'Cleaning Service'
    
    body = f"""Hi {request.customer_name},

Great news! Your service has been confirmed.

Booking Details:
- Service: {service_type}
- Date: {request.preferred_date}
- Time: {request.preferred_time.strftime('%I:%M %p')}
- Provider: {request.provider_name}
- Provider Contact: {request.provider_phone}

Your provider will arrive at the scheduled time.

Estimated Price: {format_currency(request.total_customer_paid)} (final price may vary based on actual work)

Need to reschedule? Reply to this email or call us at {app.config['ADMIN_PHONE']}.

Request ID: {request.request_id}

- HomeSwift Team"""
    
    send_email(request.customer_email, f"Your service is confirmed! - HomeSwift", body)

def send_in_progress_email(request):
    """Email 5: Job in progress notification"""
    items = json.loads(request.selected_items)
    service_type = items[0].get('category', 'Cleaning Service') if items else 'Cleaning Service'
    
    body = f"""Hi {request.customer_name},

Your service is currently in progress.

Provider {request.provider_name} is working on your {service_type}.

We'll notify you once it's complete.

Any issues? Contact us at {app.config['ADMIN_PHONE']}.

- HomeSwift Team"""
    
    send_email(request.customer_email, f"Your service is in progress - HomeSwift", body)

def send_completion_email(request):
    """Email 6: Service completion - Customer"""
    items = json.loads(request.selected_items)
    service_type = items[0].get('category', 'Cleaning Service') if items else 'Cleaning Service'
    
    body = f"""Hi {request.customer_name},

Your {service_type} has been completed!

Final Amount: {format_currency(request.total_customer_paid)}
Payment Method: {request.payment_method or 'Cash/Card'}

HOW DID WE DO?
We'd love your feedback! Rate your experience: [Link to feedback form]

Need this service again? Book now and get 10% off: [Link to app]

Thank you for using HomeSwift!

Request ID: {request.request_id}"""
    
    send_email(request.customer_email, f"Service completed! How did we do? - HomeSwift", body)

def send_admin_completion_email(request):
    """Email 7: Admin - Job completion notification"""
    items = json.loads(request.selected_items)
    service_type = items[0].get('category', 'Cleaning Service') if items else 'Cleaning Service'
    
    body = f"""Job completed successfully!

Customer: {request.customer_name}
Provider: {request.provider_name}
Service: {service_type}
Amount: {format_currency(request.total_customer_paid)}
Date: {request.preferred_date}

Commission Due: {format_currency(request.total_commission_earned)} (10%)

Request ID: {request.request_id}"""
    
    send_email(app.config['ADMIN_EMAIL'], f"Job Completed - {service_type} - {format_currency(request.total_customer_paid)}", body)

def send_reminder_email(request):
    """Email 8: Reminder (24 hours before service)"""
    items = json.loads(request.selected_items)
    service_type = items[0].get('category', 'Cleaning Service') if items else 'Cleaning Service'
    
    body = f"""Hi {request.customer_name},

This is a friendly reminder about your upcoming service:

- Service: {service_type}
- Date: TOMORROW, {request.preferred_date}
- Time: {request.preferred_time.strftime('%I:%M %p')}
- Location: {request.customer_address}
- Provider: {request.provider_name or 'TBA'} - {request.provider_phone or app.config['ADMIN_PHONE']}

Please ensure someone is available to provide access.

Need to reschedule? Call us at {app.config['ADMIN_PHONE']}.

See you tomorrow!
- HomeSwift Team"""
    
    send_email(request.customer_email, f"Reminder: Your service is tomorrow - HomeSwift", body)

@app.route('/api/admin/send-reminders', methods=['POST'])
def send_reminders():
    """Send reminder emails for services scheduled 24 hours from now"""
    try:
        tomorrow = datetime.now().date() + timedelta(days=1)
        requests = ServiceRequest.query.filter(
            ServiceRequest.preferred_date == tomorrow,
            ServiceRequest.status.in_(['confirmed', 'pending']),
            ServiceRequest.reminder_sent_at.is_(None)
        ).all()
        
        sent_count = 0
        for request in requests:
            if send_reminder_email(request):
                request.reminder_sent_at = datetime.utcnow()
                sent_count += 1
        
        db.session.commit()
        return jsonify({'message': f'Sent {sent_count} reminder emails'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin dashboard endpoints
@app.route('/api/admin/stats', methods=['GET'])
def get_admin_stats():
    """Get admin dashboard statistics"""
    total_bookings = ServiceRequest.query.count()
    pending = ServiceRequest.query.filter_by(status='pending').count()
    completed = ServiceRequest.query.filter_by(status='completed').count()
    
    # This month's revenue
    now = datetime.utcnow()
    month_start = datetime(now.year, now.month, 1)
    this_month = ServiceRequest.query.filter(
        ServiceRequest.created_at >= month_start,
        ServiceRequest.status == 'completed'
    ).all()
    
    this_month_revenue = sum(float(req.total_customer_paid) for req in this_month)
    this_month_commission = sum(float(req.total_commission_earned) for req in this_month)
    avg_commission = this_month_commission / len(this_month) if this_month else 0
    
    # Total commission
    all_completed = ServiceRequest.query.filter_by(status='completed').all()
    total_commission = sum(float(req.total_commission_earned) for req in all_completed)
    
    return jsonify({
        'total_bookings': total_bookings,
        'pending': pending,
        'completed': completed,
        'this_month_revenue': this_month_revenue,
        'this_month_commission': this_month_commission,
        'total_commission': total_commission,
        'avg_commission': avg_commission
    })

@app.route('/api/admin/financial-report', methods=['GET'])
def get_financial_report():
    """Get financial report"""
    from_date = request.args.get('from')
    to_date = request.args.get('to')
    
    query = ServiceRequest.query.filter_by(status='completed')
    
    if from_date:
        query = query.filter(ServiceRequest.created_at >= datetime.strptime(from_date, '%Y-%m-%d'))
    if to_date:
        query = query.filter(ServiceRequest.created_at <= datetime.strptime(to_date, '%Y-%m-%d'))
    
    requests = query.all()
    
    total_customer_payments = sum(float(req.total_customer_paid) for req in requests)
    total_provider_payouts = sum(float(req.total_provider_payout) for req in requests)
    total_commission = sum(float(req.total_commission_earned) for req in requests)
    avg_commission = total_commission / len(requests) if requests else 0
    
    # Breakdown by category
    category_breakdown = {}
    for req in requests:
        items = json.loads(req.selected_items)
        for item in items:
            cat = item.get('category')
            if cat not in category_breakdown:
                category_breakdown[cat] = {'count': 0, 'commission': 0}
            category_breakdown[cat]['count'] += 1
            category_breakdown[cat]['commission'] += item.get('commission', 0)
    
    return jsonify({
        'total_customer_payments': total_customer_payments,
        'total_provider_payouts': total_provider_payouts,
        'total_commission': total_commission,
        'avg_commission': avg_commission,
        'number_of_jobs': len(requests),
        'category_breakdown': category_breakdown
    })

# Seed pricing data endpoint (for initialization)
@app.route('/api/admin/seed-pricing', methods=['POST'])
def seed_pricing():
    """Seed the service_pricing table with initial data"""
    pricing_data = [
        # Couch Deep Cleaning
        ('Couch Deep Cleaning', '1 Seater Couch', '1 Seater Couch', 200, 220, 200, 220, True),
        ('Couch Deep Cleaning', '2 Seater Couch', '2 Seater Couch', 400, 440, 200, 220, True),
        ('Couch Deep Cleaning', '3 Seater Couch', '3 Seater Couch', 500, 550, 200, 220, True),
        ('Couch Deep Cleaning', '4 Seater Couch', '4 Seater Couch', 600, 660, 200, 220, True),
        ('Couch Deep Cleaning', '5 Seater Couch', '5 Seater Couch', 700, 770, 200, 220, True),
        ('Couch Deep Cleaning', '6 Seater Couch', '6 Seater Couch', 800, 880, 200, 220, True),
        ('Couch Deep Cleaning', '3 Seater L Couch', '3 Seater L Couch', 600, 660, 200, 220, True),
        ('Couch Deep Cleaning', '4 Seater L Couch', '4 Seater L Couch', 700, 770, 200, 220, True),
        ('Couch Deep Cleaning', '5 Seater L Couch', '5 Seater L Couch', 800, 880, 200, 220, True),
        ('Couch Deep Cleaning', '6 Seater L Couch', '6 Seater L Couch', 900, 990, 200, 220, True),
        # Carpet Deep Cleaning
        ('Carpet Deep Cleaning', 'Extra-Small', 'Extra-Small', 250, 275, 0, 0, False),
        ('Carpet Deep Cleaning', 'Small', 'Small', 300, 330, 0, 0, False),
        ('Carpet Deep Cleaning', 'Medium', 'Medium', 350, 385, 0, 0, False),
        ('Carpet Deep Cleaning', 'Large', 'Large', 400, 440, 0, 0, False),
        ('Carpet Deep Cleaning', 'X-Large', 'X-Large', 450, 495, 0, 0, False),
        # Fitted Carpet Deep Cleaning
        ('Fitted Carpet Deep Cleaning', 'Standard Room', 'Standard Room', 450, 495, 0, 0, False),
        ('Fitted Carpet Deep Cleaning', 'Master Bedroom', 'Master Bedroom', 600, 660, 0, 0, False),
        # Mattress Deep Cleaning
        ('Mattress Deep Cleaning', 'Single', 'Single', 350, 385, 0, 0, False),
        ('Mattress Deep Cleaning', 'Double', 'Double', 450, 495, 0, 0, False),
        ('Mattress Deep Cleaning', 'Queen', 'Queen', 500, 550, 0, 0, False),
        ('Mattress Deep Cleaning', 'King', 'King', 550, 605, 0, 0, False),
        # Headboard Deep Cleaning
        ('Headboard Deep Cleaning', 'Single', 'Single Headboard', 200, 220, 100, 110, True),
        ('Headboard Deep Cleaning', 'Double', 'Double Headboard', 250, 275, 100, 110, True),
        ('Headboard Deep Cleaning', 'Queen', 'Queen Headboard', 300, 330, 100, 110, True),
        ('Headboard Deep Cleaning', 'King', 'King Headboard', 350, 385, 100, 110, True),
        # Sleigh Bed Deep Cleaning
        ('Sleigh Bed Deep Cleaning', 'Single', 'Single Sleigh Bed', 300, 330, 150, 165, True),
        ('Sleigh Bed Deep Cleaning', 'Double', 'Double Sleigh Bed', 350, 385, 150, 165, True),
        ('Sleigh Bed Deep Cleaning', 'Queen', 'Queen Sleigh Bed', 380, 418, 150, 165, True),
        ('Sleigh Bed Deep Cleaning', 'King', 'King Sleigh Bed', 400, 440, 150, 165, True),
        # Standard Apartment Cleaning
        ('Standard Apartment Cleaning', 'Bachelor Apartment', 'Bachelor Apartment', 300, 330, 0, 0, False),
        ('Standard Apartment Cleaning', '1 Bedroom Apartment', '1BR Apartment', 350, 385, 0, 0, False),
        ('Standard Apartment Cleaning', '2 Bedroom Apartment', '2BR Apartment', 400, 440, 0, 0, False),
        ('Standard Apartment Cleaning', '3 Bedroom Apartment', '3BR Apartment', 450, 495, 0, 0, False),
        # Apartment Spring Cleaning
        ('Apartment Spring Cleaning', 'Bachelor Apartment', 'Bachelor Apartment Spring', 600, 660, 0, 0, False),
        ('Apartment Spring Cleaning', '1 Bedroom Apartment', '1BR Spring', 700, 770, 0, 0, False),
        ('Apartment Spring Cleaning', '2 Bedroom Apartment', '2BR Spring', 800, 880, 0, 0, False),
        ('Apartment Spring Cleaning', '3 Bedroom Apartment', '3BR Spring', 1000, 1100, 0, 0, False),
        # Apartment Deep Cleaning
        ('Apartment Deep Cleaning', 'Bachelor Apartment', 'Empty/With Items - Bachelor', 1800, 1980, 0, 0, False),
        ('Apartment Deep Cleaning', '1 Bedroom Apartment', '1BR Deep', 2000, 2200, 0, 0, False),
        ('Apartment Deep Cleaning', '2 Bedroom Apartment', '2BR Deep', 2500, 2750, 0, 0, False),
        ('Apartment Deep Cleaning', '3 Bedroom Apartment', '3BR Deep', 3000, 3300, 0, 0, False),
        # Empty Apartment Deep Cleaning
        ('Empty Apartment Deep Cleaning', 'Bachelor Apartment', 'Empty Bachelor', 1200, 1320, 0, 0, False),
        ('Empty Apartment Deep Cleaning', '1 Bedroom Apartment', 'Empty 1BR', 1300, 1430, 0, 0, False),
        ('Empty Apartment Deep Cleaning', '2 Bedroom Apartment', 'Empty 2BR', 1500, 1650, 0, 0, False),
        ('Empty Apartment Deep Cleaning', '3 Bedroom Apartment', 'Empty 3BR', 1800, 1980, 0, 0, False),
        # House Spring Cleaning
        ('House Spring Cleaning', '2 Bedroom House', '2BR Spring', 1800, 1980, 0, 0, False),
        ('House Spring Cleaning', '3 Bedroom House', '3BR Spring', 2100, 2310, 0, 0, False),
        ('House Spring Cleaning', '4 Bedroom House', '4BR Spring', 2500, 2750, 0, 0, False),
        ('House Spring Cleaning', '5 Bedroom House', '5BR Spring', 3000, 3300, 0, 0, False),
        # House Deep Cleaning
        ('House Deep Cleaning', '2 Bedroom House', '2BR Deep', 3600, 3960, 0, 0, False),
        ('House Deep Cleaning', '3 Bedroom House', '3BR Deep', 4500, 4950, 0, 0, False),
        ('House Deep Cleaning', '4 Bedroom House', '4BR Deep', 5400, 5940, 0, 0, False),
        ('House Deep Cleaning', '5 Bedroom House', '5BR Deep', 6500, 7150, 0, 0, False),
        # Empty House Deep Cleaning
        ('Empty House Deep Cleaning', '2 Bedroom House', 'Empty 2BR', 2500, 2750, 0, 0, False),
        ('Empty House Deep Cleaning', '3 Bedroom House', 'Empty 3BR', 3500, 3850, 0, 0, False),
        ('Empty House Deep Cleaning', '4 Bedroom House', 'Empty 4BR', 4500, 4950, 0, 0, False),
        ('Empty House Deep Cleaning', '5 Bedroom House', 'Empty 5BR', 5500, 6050, 0, 0, False),
    ]
    
    count = 0
    for data in pricing_data:
        existing = ServicePricing.query.filter_by(
            service_category=data[0],
            service_type=data[1]
        ).first()
        if not existing:
            pricing = ServicePricing(
                service_category=data[0],
                service_type=data[1],
                item_description=data[2],
                provider_base_price=data[3],
                customer_display_price=data[4],
                color_surcharge_provider=data[5],
                color_surcharge_customer=data[6],
                is_white_applicable=data[7],
                commission_percentage=10
            )
            db.session.add(pricing)
            count += 1
    
    db.session.commit()
    return jsonify({'message': f'Seeded {count} pricing records'})

if __name__ == '__main__':
    import sys
    with app.app_context():
        db.create_all()
        # Seed pricing data if table is empty
        if ServicePricing.query.count() == 0:
            # Call seed function directly
            pricing_data = [
                ('Couch Deep Cleaning', '1 Seater Couch', '1 Seater Couch', 200, 220, 200, 220, True),
                ('Couch Deep Cleaning', '2 Seater Couch', '2 Seater Couch', 400, 440, 200, 220, True),
                ('Couch Deep Cleaning', '3 Seater Couch', '3 Seater Couch', 500, 550, 200, 220, True),
                ('Couch Deep Cleaning', '4 Seater Couch', '4 Seater Couch', 600, 660, 200, 220, True),
                ('Couch Deep Cleaning', '5 Seater Couch', '5 Seater Couch', 700, 770, 200, 220, True),
                ('Couch Deep Cleaning', '6 Seater Couch', '6 Seater Couch', 800, 880, 200, 220, True),
                ('Couch Deep Cleaning', '3 Seater L Couch', '3 Seater L Couch', 600, 660, 200, 220, True),
                ('Couch Deep Cleaning', '4 Seater L Couch', '4 Seater L Couch', 700, 770, 200, 220, True),
                ('Couch Deep Cleaning', '5 Seater L Couch', '5 Seater L Couch', 800, 880, 200, 220, True),
                ('Couch Deep Cleaning', '6 Seater L Couch', '6 Seater L Couch', 900, 990, 200, 220, True),
                ('Carpet Deep Cleaning', 'Extra-Small', 'Extra-Small', 250, 275, 0, 0, False),
                ('Carpet Deep Cleaning', 'Small', 'Small', 300, 330, 0, 0, False),
                ('Carpet Deep Cleaning', 'Medium', 'Medium', 350, 385, 0, 0, False),
                ('Carpet Deep Cleaning', 'Large', 'Large', 400, 440, 0, 0, False),
                ('Carpet Deep Cleaning', 'X-Large', 'X-Large', 450, 495, 0, 0, False),
                ('Fitted Carpet Deep Cleaning', 'Standard Room', 'Standard Room', 450, 495, 0, 0, False),
                ('Fitted Carpet Deep Cleaning', 'Master Bedroom', 'Master Bedroom', 600, 660, 0, 0, False),
                ('Mattress Deep Cleaning', 'Single', 'Single', 350, 385, 0, 0, False),
                ('Mattress Deep Cleaning', 'Double', 'Double', 450, 495, 0, 0, False),
                ('Mattress Deep Cleaning', 'Queen', 'Queen', 500, 550, 0, 0, False),
                ('Mattress Deep Cleaning', 'King', 'King', 550, 605, 0, 0, False),
                ('Headboard Deep Cleaning', 'Single', 'Single Headboard', 200, 220, 100, 110, True),
                ('Headboard Deep Cleaning', 'Double', 'Double Headboard', 250, 275, 100, 110, True),
                ('Headboard Deep Cleaning', 'Queen', 'Queen Headboard', 300, 330, 100, 110, True),
                ('Headboard Deep Cleaning', 'King', 'King Headboard', 350, 385, 100, 110, True),
                ('Sleigh Bed Deep Cleaning', 'Single', 'Single Sleigh Bed', 300, 330, 150, 165, True),
                ('Sleigh Bed Deep Cleaning', 'Double', 'Double Sleigh Bed', 350, 385, 150, 165, True),
                ('Sleigh Bed Deep Cleaning', 'Queen', 'Queen Sleigh Bed', 380, 418, 150, 165, True),
                ('Sleigh Bed Deep Cleaning', 'King', 'King Sleigh Bed', 400, 440, 150, 165, True),
                ('Standard Apartment Cleaning', 'Bachelor Apartment', 'Bachelor Apartment', 300, 330, 0, 0, False),
                ('Standard Apartment Cleaning', '1 Bedroom Apartment', '1BR Apartment', 350, 385, 0, 0, False),
                ('Standard Apartment Cleaning', '2 Bedroom Apartment', '2BR Apartment', 400, 440, 0, 0, False),
                ('Standard Apartment Cleaning', '3 Bedroom Apartment', '3BR Apartment', 450, 495, 0, 0, False),
                ('Apartment Spring Cleaning', 'Bachelor Apartment', 'Bachelor Apartment Spring', 600, 660, 0, 0, False),
                ('Apartment Spring Cleaning', '1 Bedroom Apartment', '1BR Spring', 700, 770, 0, 0, False),
                ('Apartment Spring Cleaning', '2 Bedroom Apartment', '2BR Spring', 800, 880, 0, 0, False),
                ('Apartment Spring Cleaning', '3 Bedroom Apartment', '3BR Spring', 1000, 1100, 0, 0, False),
                ('Apartment Deep Cleaning', 'Bachelor Apartment', 'Empty/With Items - Bachelor', 1800, 1980, 0, 0, False),
                ('Apartment Deep Cleaning', '1 Bedroom Apartment', '1BR Deep', 2000, 2200, 0, 0, False),
                ('Apartment Deep Cleaning', '2 Bedroom Apartment', '2BR Deep', 2500, 2750, 0, 0, False),
                ('Apartment Deep Cleaning', '3 Bedroom Apartment', '3BR Deep', 3000, 3300, 0, 0, False),
                ('Empty Apartment Deep Cleaning', 'Bachelor Apartment', 'Empty Bachelor', 1200, 1320, 0, 0, False),
                ('Empty Apartment Deep Cleaning', '1 Bedroom Apartment', 'Empty 1BR', 1300, 1430, 0, 0, False),
                ('Empty Apartment Deep Cleaning', '2 Bedroom Apartment', 'Empty 2BR', 1500, 1650, 0, 0, False),
                ('Empty Apartment Deep Cleaning', '3 Bedroom Apartment', 'Empty 3BR', 1800, 1980, 0, 0, False),
                ('House Spring Cleaning', '2 Bedroom House', '2BR Spring', 1800, 1980, 0, 0, False),
                ('House Spring Cleaning', '3 Bedroom House', '3BR Spring', 2100, 2310, 0, 0, False),
                ('House Spring Cleaning', '4 Bedroom House', '4BR Spring', 2500, 2750, 0, 0, False),
                ('House Spring Cleaning', '5 Bedroom House', '5BR Spring', 3000, 3300, 0, 0, False),
                ('House Deep Cleaning', '2 Bedroom House', '2BR Deep', 3600, 3960, 0, 0, False),
                ('House Deep Cleaning', '3 Bedroom House', '3BR Deep', 4500, 4950, 0, 0, False),
                ('House Deep Cleaning', '4 Bedroom House', '4BR Deep', 5400, 5940, 0, 0, False),
                ('House Deep Cleaning', '5 Bedroom House', '5BR Deep', 6500, 7150, 0, 0, False),
                ('Empty House Deep Cleaning', '2 Bedroom House', 'Empty 2BR', 2500, 2750, 0, 0, False),
                ('Empty House Deep Cleaning', '3 Bedroom House', 'Empty 3BR', 3500, 3850, 0, 0, False),
                ('Empty House Deep Cleaning', '4 Bedroom House', 'Empty 4BR', 4500, 4950, 0, 0, False),
                ('Empty House Deep Cleaning', '5 Bedroom House', 'Empty 5BR', 5500, 6050, 0, 0, False),
            ]
            for data in pricing_data:
                pricing = ServicePricing(
                    service_category=data[0], service_type=data[1], item_description=data[2],
                    provider_base_price=data[3], customer_display_price=data[4],
                    color_surcharge_provider=data[5], color_surcharge_customer=data[6],
                    is_white_applicable=data[7], commission_percentage=10
                )
                db.session.add(pricing)
            db.session.commit()
            print("Pricing data seeded successfully")
        if '--cleanup-duplicates' in sys.argv:
            # Remove duplicate bookings
            from sqlalchemy import and_
            seen = set()
            duplicates = []
            for b in Booking.query.order_by(Booking.id).all():
                key = (b.name.strip().lower(), b.date, b.time, b.service.strip().lower())
                if key in seen:
                    duplicates.append(b)
                else:
                    seen.add(key)
            for dup in duplicates:
                db.session.delete(dup)
            db.session.commit()
            print("Removed {} duplicate bookings.".format(len(duplicates)))
        else:
            # Get port from environment variable (for Render) or use 5001 for local
            port = int(os.environ.get('PORT', 5001))
            app.run(debug=False, host='0.0.0.0', port=port)
