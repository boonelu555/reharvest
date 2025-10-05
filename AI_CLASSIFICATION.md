# AI Food Classification Feature

## Overview
This project now includes TensorFlow.js-powered image classification to automatically fill out food listings from uploaded photos.

## How It Works

### 1. **Upload a Photo**
When creating a new food listing, businesses can upload a photo of their surplus food.

### 2. **AI Analysis**
Click the "Auto-Fill with AI" button that appears after uploading an image. The system will:
- Load the MobileNet pre-trained model (runs in the browser)
- Analyze the image to detect food items
- Map predictions to food categories (bakery, produce, prepared_meals, dairy, meat, beverages, other)

### 3. **Auto-Fill Form**
The AI will automatically populate:
- **Title**: Generated from the top prediction (e.g., "Fresh Pizza")
- **Description**: Includes top 3 predictions with confidence scores
- **Category**: Mapped to your food category system

### 4. **Review & Edit**
Users can review and edit the AI-generated fields before submitting.

## Technical Details

### Models Used
- **MobileNet**: A lightweight image classification model trained on ImageNet
- Runs entirely in the browser (no server required)
- First load downloads ~4MB model

### Food Categories Supported
- Bakery items (bread, pastries, cakes, etc.)
- Fresh produce (fruits, vegetables)
- Prepared meals (pizza, sandwiches, etc.)
- Dairy products
- Meat products
- Beverages
- Other (fallback)

### Files Modified/Created
1. `src/services/foodClassifier.ts` - Core AI classification service
2. `src/hooks/useListingForm.ts` - Integrated classification into form logic
3. `src/components/listing/ListingBasicInfo.tsx` - Added AI button UI
4. `src/components/CreateListingDialog.tsx` - Connected AI functionality

## Usage Example

```typescript
// The classification happens automatically when user clicks the button
// Results are populated into the form:
{
  title: "Fresh Pizza",
  description: "AI detected: pizza (95% confidence), cheese pizza (87% confidence), pepperoni pizza (82% confidence). Please verify and adjust details as needed.",
  category: "prepared_meals"
}
```

## Performance
- Model loads once and caches in memory
- Classification takes 1-3 seconds depending on device
- Works offline after initial model download

## Future Enhancements
- Custom food model trained on surplus food images
- Multi-item detection
- Quantity estimation
- Freshness detection
- Allergen detection
