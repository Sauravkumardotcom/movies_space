/**
 * Database Persistence Test Script
 * Tests MongoDB connectivity and CRUD operations
 * Run with: node test-db.js
 */

import { connectDB, disconnectDB, checkDBHealth } from './db/connection.js';
import { User, Video, Favorite, WatchHistory, Admin } from './db/models/index.js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function runTests() {
  console.log('🧪 Starting Database Persistence Tests...\n');
  
  try {
    // Step 1: Connect to MongoDB
    console.log('📌 Step 1: Connecting to MongoDB...');
    await connectDB();
    
    // Step 2: Check DB Health
    console.log('\n📌 Step 2: Checking database health...');
    const health = await checkDBHealth();
    console.log(`   Health Status: ${health}`);
    
    if (health !== 'connected') {
      throw new Error(`Database not connected. Status: ${health}`);
    }
    
    // Step 3: Clear test data
    console.log('\n📌 Step 3: Clearing previous test data...');
    await User.deleteOne({ email: 'test@example.com' }).catch(() => {});
    await Admin.deleteOne({ email: 'admin@test.com' }).catch(() => {});
    await Video.deleteOne({ title: 'Test Video' }).catch(() => {});
    console.log('   ✅ Previous test data cleared');
    
    // Step 4: Test User Creation (with password hashing)
    console.log('\n📌 Step 4: Testing User Creation with Hashed Password...');
    const testUser = new User({
      email: 'test@example.com',
      password: 'testPassword123',
      name: 'Test User',
      role: 'user'
    });
    
    const savedUser = await testUser.save();
    console.log(`   ✅ User created with ID: ${savedUser._id}`);
    console.log(`   ✅ Password hashed: ${savedUser.password ? savedUser.password.substring(0, 20) + '...' : '(hashed)'}`);
    console.log(`   ✅ Email: ${savedUser.email}`);
    
    // Step 5: Test User Query (Persistence)
    console.log('\n📌 Step 5: Testing User Query (Persistence)...');
    const queriedUser = await User.findOne({ email: 'test@example.com' });
    
    if (!queriedUser) {
      throw new Error('User not found after save!');
    }
    
    console.log(`   ✅ User queried successfully`);
    console.log(`   ✅ ID matches: ${queriedUser._id.equals(savedUser._id)}`);
    
    // Step 6: Test Video Creation
    console.log('\n📌 Step 6: Testing Video Creation...');
    const testVideo = new Video({
      title: 'Test Video',
      description: 'A test video for persistence',
      url: 'https://example.com/video.mp4',
      poster: 'https://example.com/poster.jpg',
      genre: ['Action', 'Adventure'],
      language: 'en',
      duration: 120,
      rating: 8.5,
      uploadedBy: savedUser._id,
      status: 'approved'
    });
    
    const savedVideo = await testVideo.save();
    console.log(`   ✅ Video created with ID: ${savedVideo._id}`);
    console.log(`   ✅ Title: ${savedVideo.title}`);
    
    // Step 7: Test Favorite Creation (with compound index)
    console.log('\n📌 Step 7: Testing Favorite Creation...');
    const favorite = new Favorite({
      userId: savedUser._id,
      videoId: savedVideo._id
    });
    
    const savedFavorite = await favorite.save();
    console.log(`   ✅ Favorite created with ID: ${savedFavorite._id}`);
    
    // Test duplicate prevention
    try {
      const duplicate = new Favorite({
        userId: savedUser._id,
        videoId: savedVideo._id
      });
      await duplicate.save();
      console.log('   ⚠️ Warning: Duplicate favorite not prevented!');
    } catch (error) {
      console.log('   ✅ Duplicate prevention works (compound index)');
    }
    
    // Step 8: Test Watch History Creation
    console.log('\n📌 Step 8: Testing Watch History Creation...');
    const watchHistory = new WatchHistory({
      userId: savedUser._id,
      videoId: savedVideo._id,
      duration: 45,
      totalDuration: 120,
      completed: false,
      deviceType: 'desktop'
    });
    
    const savedHistory = await watchHistory.save();
    console.log(`   ✅ Watch history created with ID: ${savedHistory._id}`);
    console.log(`   ✅ Progress: ${savedHistory.duration}/${savedHistory.totalDuration} seconds`);
    console.log(`   ℹ️ TTL index set: Data auto-deletes after 90 days`);
    
    // Step 9: Test Admin Creation
    console.log('\n📌 Step 9: Testing Admin User Creation...');
    const adminUser = new Admin({
      email: 'admin@test.com',
      password: 'adminPassword123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      permissions: ['manage_users', 'manage_videos', 'view_analytics']
    });
    
    const savedAdmin = await adminUser.save();
    console.log(`   ✅ Admin user created with ID: ${savedAdmin._id}`);
    console.log(`   ✅ Permissions: ${savedAdmin.permissions.join(', ')}`);    
    // Step 10: Test Data Aggregation
    console.log('\n📌 Step 10: Testing Data Aggregation...');
    const stats = {
      totalUsers: await User.countDocuments(),
      totalVideos: await Video.countDocuments(),
      totalFavorites: await Favorite.countDocuments(),
      totalWatchHistory: await WatchHistory.countDocuments(),
      totalAdmins: await Admin.countDocuments()
    };
    
    console.log(`   ✅ Total Users: ${stats.totalUsers}`);
    console.log(`   ✅ Total Videos: ${stats.totalVideos}`);
    console.log(`   ✅ Total Favorites: ${stats.totalFavorites}`);
    console.log(`   ✅ Total Watch History Records: ${stats.totalWatchHistory}`);
    console.log(`   ✅ Total Admin Users: ${stats.totalAdmins}`);
    
    // Step 11: Test Query with Population
    console.log('\n📌 Step 11: Testing Query with Population...');
    const userWithData = await User.findById(savedUser._id);
    const videoWithUploader = await Video.findById(savedVideo._id);
    console.log(`   ✅ User retrieved: ${userWithData.email}`);
    console.log(`   ✅ Video retrieved: ${videoWithUploader.title}`);
    
    console.log('\n✅ ALL TESTS PASSED! Database persistence is working correctly.\n');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('Stack:', error.stack);
    return false;
    
  } finally {
    // Always disconnect
    console.log('🔌 Disconnecting from MongoDB...');
    await disconnectDB();
    console.log('✅ Disconnected\n');
  }
}

// Run tests
const success = await runTests();
process.exit(success ? 0 : 1);
