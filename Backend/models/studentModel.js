import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import validator from 'validator';
import crypto from 'crypto';

const studentSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First name is required'],
			trim: true,
			minlength: [2, 'First name must be at least 2 characters long'],
			maxlength: [50, 'First name cannot exceed 50 characters'],
		},
		lastName: {
			type: String,
			required: [true, 'Last name is required'],
			trim: true,
			minlength: [2, 'Last name must be at least 2 characters long'],
			maxlength: [50, 'Last name cannot exceed 50 characters'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
			validate: [validator.isEmail, 'Please provide a valid email'],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [8, 'Password must be at least 8 characters long'],
			select: false, // Don't include password in queries by default
		},
		rollNumber: {
			type: String,
			required: [true, 'Roll number is required'],
			unique: true,
			trim: true,
			uppercase: true,
			validate: {
				validator: function (v) {
					return /^[A-Z0-9]{6,12}$/.test(v);
				},
				message:
					'Roll number must be 6-12 characters long and contain only letters and numbers',
			},
		},
		phoneNumber: {
			type: String,
			required: [true, 'Phone number is required'],
			validate: {
				validator: function (v) {
					return /^\+?[\d\s-()]{10,15}$/.test(v);
				},
				message: 'Please provide a valid phone number',
			},
		},
		dateOfBirth: {
			type: Date,
			required: [true, 'Date of birth is required'],
			validate: {
				validator: function (v) {
					return v < new Date();
				},
				message: 'Date of birth cannot be in the future',
			},
		},
		gender: {
			type: String,
			required: [true, 'Gender is required'],
			enum: {
				values: ['male', 'female', 'other'],
				message: 'Gender must be either male, female, or other',
			},
		},
		year: {
			type: String,
			required: [true, 'Academic year is required'],
			enum: {
				values: ['1', '2', '3', '4'],
				message: 'Year must be 1, 2, 3, or 4',
			},
		},
		semester: {
			type: String,
			required: [true, 'Semester is required'],
			enum: {
				values: ['1', '2', '3', '4', '5', '6', '7', '8'],
				message: 'Semester must be between 1 and 8',
			},
		},
		section: {
			type: String,
			required: [true, 'Section is required'],
			trim: true,
			uppercase: true,
			validate: {
				validator: function (v) {
					return /^[A-Z]$/.test(v);
				},
				message: 'Section must be a single uppercase letter',
			},
		},
		address: {
			street: {
				type: String,
				required: [true, 'Street address is required'],
				trim: true,
			},
			city: {
				type: String,
				required: [true, 'City is required'],
				trim: true,
			},
			state: {
				type: String,
				required: [true, 'State is required'],
				trim: true,
			},
			postalCode: {
				type: String,
				required: [true, 'Postal code is required'],
				trim: true,
				validate: {
					validator: function (v) {
						return /^\d{5,6}$/.test(v);
					},
					message: 'Postal code must be 5 or 6 digits',
				},
			},
			country: {
				type: String,
				required: [true, 'Country is required'],
				trim: true,
				default: 'India',
			},
		},
		department: {
			type: String,
			required: [true, 'Department is required'],
			trim: true,
			enum: {
				values: [
					'Computer Science',
					'Information Technology',
					'Electronics',
					'Mechanical',
					'Civil',
					'Electrical',
					'Chemical',
					'Aerospace',
					'Biotechnology',
					'Other',
				],
				message: 'Please select a valid department',
			},
		},
		courses: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Course',
			},
		],
		profilePicture: {
			type: String,
			default: null,
		},
		emergencyContact: {
			name: {
				type: String,
				required: [true, 'Emergency contact name is required'],
				trim: true,
			},
			relationship: {
				type: String,
				required: [true, 'Emergency contact relationship is required'],
				trim: true,
			},
			phoneNumber: {
				type: String,
				required: [true, 'Emergency contact phone number is required'],
				validate: {
					validator: function (v) {
						return /^\+?[\d\s-()]{10,15}$/.test(v);
					},
					message: 'Please provide a valid emergency contact phone number',
				},
			},
		},
		academicStatus: {
			type: String,
			enum: {
				values: ['active', 'suspended', 'graduated', 'dropped', 'transferred'],
				message: 'Invalid academic status',
			},
			default: 'active',
		},
		gpa: {
			type: Number,
			min: [0, 'GPA cannot be negative'],
			max: [10, 'GPA cannot exceed 10'],
			default: 0,
		},
		admissionDate: {
			type: Date,
			required: [true, 'Admission date is required'],
			default: Date.now,
		},
		lastLoginAt: {
			type: Date,
			default: null,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		emailVerificationToken: {
			type: String,
			select: false,
		},
		passwordResetToken: {
			type: String,
			select: false,
		},
		passwordResetExpires: {
			type: Date,
			select: false,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Virtual for full name
studentSchema.virtual('fullName').get(function () {
	return `${this.firstName} ${this.lastName}`;
});

// Virtual for age calculation
studentSchema.virtual('age').get(function () {
	if (!this.dateOfBirth) return null;
	const today = new Date();
	const birthDate = new Date(this.dateOfBirth);
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
});

// Virtual for full address
studentSchema.virtual('fullAddress').get(function () {
	if (!this.address) return '';
	const { street, city, state, postalCode, country } = this.address;
	return `${street}, ${city}, ${state} ${postalCode}, ${country}`;
});

// Pre-save middleware to hash password
studentSchema.pre('save', async function (next) {
	// Only hash the password if it has been modified (or is new)
	if (!this.isModified('password')) return next();

	try {
		// Hash the password with cost of 12
		this.password = await bcrypt.hash(this.password, 12);
		next();
	} catch (error) {
		next(error);
	}
});

// Pre-save middleware to update lastLoginAt
studentSchema.pre('save', function (next) {
	if (this.isNew || this.isModified('lastLoginAt')) {
		this.lastLoginAt = new Date();
	}
	next();
});

// Instance method to check password
studentSchema.methods.correctPassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if password was changed after a given timestamp
studentSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return JWTTimestamp < changedTimestamp;
	}
	return false;
};

// Instance method to create password reset token
studentSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

	return resetToken;
};

// Instance method to generate email verification token
studentSchema.methods.createEmailVerificationToken = function () {
	const verificationToken = crypto.randomBytes(32).toString('hex');

	this.emailVerificationToken = crypto
		.createHash('sha256')
		.update(verificationToken)
		.digest('hex');

	return verificationToken;
};

// Static method to find students by department
studentSchema.statics.findByDepartment = function (department) {
	return this.find({ department: department, academicStatus: 'active' });
};

// Static method to find students by year and section
studentSchema.statics.findByYearAndSection = function (year, section) {
	return this.find({
		year: year,
		section: section,
		academicStatus: 'active',
	}).populate('courses');
};

// Static method to get student statistics
studentSchema.statics.getStatistics = async function () {
	const stats = await this.aggregate([
		{
			$group: {
				_id: '$department',
				totalStudents: { $sum: 1 },
				averageGPA: { $avg: '$gpa' },
				activeStudents: {
					$sum: { $cond: [{ $eq: ['$academicStatus', 'active'] }, 1, 0] },
				},
			},
		},
		{
			$sort: { totalStudents: -1 },
		},
	]);

	return stats;
};

// Index for better query performance
studentSchema.index({ email: 1 });
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ department: 1, year: 1, section: 1 });
studentSchema.index({ academicStatus: 1 });
studentSchema.index({ createdAt: -1 });

const Student = mongoose.model('Student', studentSchema);

export default Student;
