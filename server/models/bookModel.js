import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required']
  },
  author: {
    type: String,
    required: [true, 'Author name is required']
  },
  isbn: {
    type: String,
    unique: true
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  availableCopies: {
    type: Number,
    min: 0,
    validate: {
      validator: function (value) {
        return value <= this.quantity
      },
      message: "Available copies cannot exceed the total quantity",
    },
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region',
    required: true
  }
}, {
  timestamps: true
});

bookSchema.pre("save", function (next) {
  if (this.isNew) {
    this.availableCopies = this.quantity
  }
  next()
})

export default mongoose.model('Book', bookSchema);