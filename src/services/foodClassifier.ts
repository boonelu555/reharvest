import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

// Food category mapping from MobileNet predictions to our categories
const FOOD_CATEGORIES = {
  'bakery': ['bagel', 'bread', 'pretzel', 'croissant', 'bun', 'baguette', 'muffin', 'cupcake', 'cake', 'pastry', 'doughnut', 'cookie'],
  'produce': ['apple', 'banana', 'orange', 'strawberry', 'grape', 'pineapple', 'watermelon', 'lemon', 'cucumber', 'broccoli', 'carrot', 'cabbage', 'cauliflower', 'lettuce', 'tomato', 'potato', 'onion', 'pepper', 'mushroom', 'corn', 'pumpkin', 'zucchini'],
  'prepared_meals': ['pizza', 'hamburger', 'hotdog', 'burrito', 'taco', 'sandwich', 'sushi', 'noodle', 'pasta', 'soup', 'stew', 'curry', 'rice', 'salad'],
  'dairy': ['cheese', 'milk', 'yogurt', 'ice cream', 'butter'],
  'meat': ['steak', 'chicken', 'turkey', 'bacon', 'sausage', 'meat loaf'],
  'beverages': ['coffee', 'tea', 'juice', 'smoothie', 'wine', 'beer'],
  'other': []
};

export interface ClassificationResult {
  category: string;
  title: string;
  description: string;
  confidence: number;
}

class FoodClassifier {
  private model: mobilenet.MobileNet | null = null;
  private isLoading = false;

  async loadModel(): Promise<void> {
    if (this.model) {
      console.log('Model already loaded');
      return;
    }
    
    if (this.isLoading) {
      console.log('Model is already loading, waiting...');
      // Wait for the current load to complete
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }
    
    this.isLoading = true;
    console.log('Starting to load MobileNet model...');
    
    try {
      // Set TensorFlow backend (try WebGL first, fallback to CPU)
      await tf.ready();
      console.log('TensorFlow.js ready, backend:', tf.getBackend());
      
      // Load MobileNet model
      this.model = await mobilenet.load();
      console.log('✅ MobileNet model loaded successfully');
    } catch (error) {
      console.error('❌ Error loading model:', error);
      this.isLoading = false;
      throw new Error(`Failed to load AI model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.isLoading = false;
    }
  }

  async classifyImage(imageElement: HTMLImageElement): Promise<ClassificationResult> {
    console.log('Starting classification...');
    console.log('Image dimensions:', imageElement.width, 'x', imageElement.height);
    console.log('Image src length:', imageElement.src?.length || 0);
    
    if (!this.model) {
      console.log('Model not loaded, loading now...');
      await this.loadModel();
    }

    if (!this.model) {
      throw new Error('Model not loaded after loadModel() call');
    }

    try {
      console.log('Running classification...');
      // Get predictions from MobileNet
      const predictions = await this.model.classify(imageElement);
      
      console.log('Raw predictions:', predictions);
      
      if (!predictions || predictions.length === 0) {
        throw new Error('No predictions returned from model');
      }

      // Get the top prediction
      const topPrediction = predictions[0];
      const className = topPrediction.className.toLowerCase();
      const confidence = topPrediction.probability;

      console.log('Top prediction:', className, 'confidence:', confidence);

      // Map to our food categories
      const category = this.mapToFoodCategory(className);
      console.log('Mapped category:', category);
      
      // Generate title and description
      const title = this.generateTitle(className, predictions);
      const description = this.generateDescription(predictions);

      const result = {
        category,
        title,
        description,
        confidence
      };
      
      console.log('✅ Classification result:', result);
      return result;
    } catch (error) {
      console.error('❌ Classification error:', error);
      if (error instanceof Error) {
        throw new Error(`Classification failed: ${error.message}`);
      }
      throw new Error('Failed to classify image: Unknown error');
    }
  }

  private mapToFoodCategory(prediction: string): string {
    const lowerPrediction = prediction.toLowerCase();
    
    for (const [category, keywords] of Object.entries(FOOD_CATEGORIES)) {
      for (const keyword of keywords) {
        if (lowerPrediction.includes(keyword) || keyword.includes(lowerPrediction)) {
          return category;
        }
      }
    }
    
    return 'other';
  }

  private generateTitle(mainPrediction: string, predictions: any[]): string {
    // Clean up the prediction text
    const cleaned = mainPrediction
      .split(',')[0] // Take first part if comma-separated
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return `Fresh ${cleaned}`;
  }

  private generateDescription(predictions: any[]): string {
    const topThree = predictions.slice(0, 3);
    const descriptions = topThree.map(p => {
      const name = p.className.split(',')[0].replace(/_/g, ' ');
      const confidence = Math.round(p.probability * 100);
      return `${name} (${confidence}% confidence)`;
    });
    
    return `AI detected: ${descriptions.join(', ')}. Please verify and adjust details as needed.`;
  }

  // Helper method to create an image element from a file
  async createImageElement(file: File): Promise<HTMLImageElement> {
    console.log('Creating image element from file:', file.name, file.type, file.size, 'bytes');
    
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (!result) {
          reject(new Error('Failed to read file data'));
          return;
        }

        img.onload = () => {
          console.log('✅ Image loaded successfully:', img.width, 'x', img.height);
          resolve(img);
        };
        
        img.onerror = (error) => {
          console.error('❌ Image load error:', error);
          reject(new Error('Failed to load image element'));
        };
        
        img.crossOrigin = 'anonymous'; // Prevent CORS issues
        img.src = result as string;
      };

      reader.onerror = (error) => {
        console.error('❌ FileReader error:', error);
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  // Dispose of the model to free up memory
  dispose(): void {
    if (this.model) {
      // MobileNet doesn't have a dispose method, but we can clear the reference
      this.model = null;
    }
  }
}

// Export a singleton instance
export const foodClassifier = new FoodClassifier();
