import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const testConnection = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI
    
    if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
      console.log('MongoDB URI not configured. Please update your .env file with your MongoDB Atlas connection string.')
      console.log('Example: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority')
      return
    }
    
    console.log('Testing MongoDB connection...')
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connection successful!')
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({
      test: String,
      timestamp: { type: Date, default: Date.now }
    })
    
    const TestModel = mongoose.model('Test', testSchema)
    
    const testDoc = new TestModel({ test: 'Connection test' })
    await testDoc.save()
    console.log('Test document created successfully')
    
    // Clean up
    await TestModel.deleteMany({})
    console.log('Test documents cleaned up')
    
    await mongoose.connection.close()
    console.log('MongoDB connection closed')
    
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

testConnection()
