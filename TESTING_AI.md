# Testing the AI Food Classification Feature

## Quick Start Guide

### 1. Start the Development Server
```bash
cd "/Users/boone/hellohacks project/reharvest-van-connect"
npm run dev
```
Open http://localhost:8080

### 2. Navigate to Create Listing
1. Sign in as a **Provider** account
2. Go to your dashboard
3. Click "Create New Listing" or similar button

### 3. Test AI Classification

#### Step-by-Step:
1. **Upload an image** of food (click the file input)
2. Wait for the preview to appear
3. Click the **"Auto-Fill with AI"** button (with sparkles icon ✨)
4. Watch the button change to "Analyzing Image..." with a spinner
5. After 1-3 seconds, the form fields will auto-populate:
   - Title field
   - Description field
   - Category dropdown

#### What to Test With:
- **Pizza photo** → Should detect "prepared_meals" category
- **Bread/pastries** → Should detect "bakery" category
- **Fruits/vegetables** → Should detect "produce" category
- **Sandwiches** → Should detect "prepared_meals" category

### 4. Expected Behavior

✅ **Success Case:**
- Toast notification: "AI Classification Complete!"
- Shows confidence percentage
- Form fields are filled automatically
- You can still edit the fields

❌ **Error Cases:**
- No image uploaded → "Please upload an image first"
- Classification fails → "Could not analyze the image"
- Form fields remain editable

### 5. Console Logs
Open browser DevTools (F12) → Console tab to see:
- "MobileNet model loaded successfully"
- Classification predictions and confidence scores
- Any errors during processing

## Test Images

### Good Test Images:
- Clear, well-lit photos of food
- Single food item in focus
- Common food items (pizza, bread, fruits, etc.)

### Challenging Test Images:
- Multiple food items
- Blurry or dark photos
- Uncommon food items
- Non-food items (should fallback to "other")

## Troubleshooting

### Model Not Loading
- Check internet connection (first load downloads ~4MB)
- Check browser console for errors
- Try refreshing the page

### Classification Taking Too Long
- Normal on first run (model download)
- Subsequent runs should be 1-3 seconds
- Check browser console for errors

### Incorrect Classifications
- MobileNet is trained on general images, not specialized for food
- Edit the auto-filled fields as needed
- Consider the AI as a helpful starting point, not perfect

## Performance Notes
- **First classification**: 5-10 seconds (model download + inference)
- **Subsequent classifications**: 1-3 seconds (inference only)
- **Model size**: ~4MB (cached by browser)
- **Runs entirely in browser**: No server calls needed
