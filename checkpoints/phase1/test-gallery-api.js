const testGalleryAPI = async () => {
  const baseURL = 'http://localhost:5000/api/gallery';
  
  try {
    // Test 1: Get all gallery photos (should return empty array initially)
    console.log('Testing GET /api/gallery/photos...');
    const photosResponse = await fetch(`${baseURL}/photos`);
    const photosData = await photosResponse.json();
    console.log('Gallery photos response:', photosData);
    
    // Test 2: Get gallery categories
    console.log('\nTesting GET /api/gallery/categories...');
    const categoriesResponse = await fetch(`${baseURL}/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log('Gallery categories response:', categoriesData);
    
    // Test 3: Test slideshow endpoint (existing)
    console.log('\nTesting GET /api/gallery/ (slideshow)...');
    const slideshowResponse = await fetch(`${baseURL}/`);
    const slideshowData = await slideshowResponse.json();
    console.log('Slideshow response:', slideshowData);
    
    console.log('\nAll basic API tests completed successfully!');
    
  } catch (error) {
    console.error('API test failed:', error);
  }
};

// Run the test
testGalleryAPI();
