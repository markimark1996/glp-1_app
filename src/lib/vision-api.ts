import { ProductInfo } from '../types';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface VisionAPIResponse {
  responses: Array<{
    textAnnotations: Array<{
      description: string;
      boundingPoly: {
        vertices: Array<{
          x: number;
          y: number;
        }>;
      };
    }>;
    labelAnnotations: Array<{
      description: string;
      score: number;
    }>;
  }>;
}

interface GeminiAPIResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
  }>;
}

function validateApiKey(apiKey: string | undefined): string {
  if (!apiKey) {
    throw new Error('Vision API key not configured');
  }
  if (!apiKey.startsWith('AIza')) {
    throw new Error('Invalid Vision API key format');
  }
  return apiKey;
}

export async function analyzeImage(imageBase64: string): Promise<ProductInfo> {
  try {
    // Validate API key
    const apiKey = validateApiKey(import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY);
  
    // Validate base64 string
    if (!imageBase64 || !imageBase64.includes('base64')) {
      throw new Error('Invalid image data');
    }
  
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Return the brand and product title, in one line, nothing else."
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: imageBase64.split(',')[1]
                }
              }
            ]
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || response.statusText;
      
      if (errorMessage.includes('API has not been used') || 
          errorMessage.includes('disabled') ||
          errorMessage.includes('blocked')) {
        throw new Error('VISION_API_UNAVAILABLE');
      }
      
      throw new Error(`API Error: ${errorMessage}`);
    }
    
    const data: GeminiAPIResponse = await response.json();
    
    if (!data.candidates?.[0]) {
      throw new Error('No response data from Vision API');
    }
    
    const textContent = data.candidates[0].content.parts.find(part => part.text)?.text || '';
    
    // Process the text content to extract product information
    return processText(textContent);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error analyzing image:', errorMessage);
    throw error;
  }
}

function processText(text: string): ProductInfo {
  const lines = text.split('\n');

  // Initialize product info with default values
  const productInfo: ProductInfo = {
    id: crypto.randomUUID(),
    name: '',
    brand: '',
    nutritionalInfo: {
      servingSize: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      sugar: '',
    },
    ingredients: [],
    allergens: [],
    dietaryInfo: {
      vegan: false,
      vegetarian: false,
      glutenFree: false,
    },
    weight: '',
    manufacturer: '',
    certifications: [],
    barcode: '',
    imageUrl: '',
  };

  // Process text lines to extract information
  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    // Extract product name (usually one of the first lines)
    if (!productInfo.name && line.length > 3 && !lowerLine.includes('ingredients')) {
      productInfo.name = line;
    }
  }

  // Mock data based on product name
  if (productInfo.name.toLowerCase().includes('bean')) {
    productInfo.brand = 'Heinz';
   
    productInfo.nutritionalInfo.servingSize = 'Per 1/2 can';
    productInfo.nutritionalInfo.calories = '168kcal';
    productInfo.nutritionalInfo.protein = '0';
    productInfo.nutritionalInfo.carbs = '0';
    productInfo.nutritionalInfo.fat = '0.7';
    productInfo.nutritionalInfo.fiber = '0';
    productInfo.nutritionalInfo.sugar = '8.9';
    
    productInfo.ingredients = ['Beans (50%)', 'Tomatoes (36%)', 'Water', 'Sugar', 'Spirit Vinegar', 'Modified Cornflour', 'Salt', 'Spice Extracts', 'Herb Extract'];
    productInfo.allergens = ['Pulses, beans & peas'];
    productInfo.dietaryInfo.vegan = true;
    productInfo.dietaryInfo.vegetarian = true;
    productInfo.dietaryInfo.glutenFree = true;
    productInfo.dietaryInfo.highProtein = true;
    productInfo.dietaryInfo.highFibre = true;
    
    productInfo.weight = '415g';
    productInfo.manufacturer = 'Heinz';
    productInfo.certifications = ['Suitable for Vegans', 'Green Dot'];
    productInfo.barcode = '05000157024671';
    productInfo.imageUrl = 'https://m.media-amazon.com/images/I/71JFUriLVKS._SL1500_.jpg';
  } else if (productInfo.name.toLowerCase().includes('kit')) {
    productInfo.brand = 'Kitkat';
   
    productInfo.nutritionalInfo.servingSize = 'Per bar';
    productInfo.nutritionalInfo.calories = '165kcal';
    productInfo.nutritionalInfo.protein = '2.1';
    productInfo.nutritionalInfo.carbs = '19.3';
    productInfo.nutritionalInfo.fat = '8.7';
    productInfo.nutritionalInfo.fiber = '0.7';
    productInfo.nutritionalInfo.sugar = '14.6';
    
    productInfo.ingredients = ['Sugar', 'Wheat Flour', 'Skimmed Milk Powder', 'Vegetable Fats (Palm, Shea)', 'Cocoa Butter', 'Cocoa Mass', 'Glucose Syrup', 'Whey Powder Product (Milk)', 'Butterfat (Milk)', 'Fat-Reduced Cocoa Powder', 'Emulsifier (Lecithins)', 'Raising Agent (Sodium Bicarbonate)', 'Flavouring'];
    productInfo.allergens = ['Gluten', 'Lactose', 'Milk', 'Nuts & peanuts'];
    productInfo.dietaryInfo.vegan = false;
    productInfo.dietaryInfo.vegetarian = true;
    productInfo.dietaryInfo.glutenFree = false;
    productInfo.dietaryInfo.highProtein = false;
    productInfo.dietaryInfo.highFibre = false;
    
    productInfo.weight = '41.5g';
    productInfo.manufacturer = 'Kitkat';
    productInfo.certifications = ['Rainforest Alliance - People & Nature, Cocoa', 'Suitable for vegetarians'];
    productInfo.barcode = '07613036701686';
    productInfo.imageUrl = 'https://m.media-amazon.com/images/I/61pXH6GHFNS._AC_UF1000,1000_QL80_.jpg';
  } else if (productInfo.name.toLowerCase().includes('walkers')) {
    productInfo.brand = 'Walkers';
   
    productInfo.nutritionalInfo.servingSize = 'Per pack';
    productInfo.nutritionalInfo.calories = '230kcal';
    productInfo.nutritionalInfo.protein = '2.8';
    productInfo.nutritionalInfo.carbs = '24';
    productInfo.nutritionalInfo.fat = '13';
    productInfo.nutritionalInfo.fiber = '1.7';
    productInfo.nutritionalInfo.sugar = '0.2';
    
    productInfo.ingredients = ['Potatoes','Vegetable Oils (Sunflower, Rapeseed, in varying proportions)', 'Salt and Vinegar Seasoning [Flavouring, Salt, Acids (Citric Acid, Malic Acid), Yeast Extract, Potassium Chloride]', 'Antioxidants (Rosemary Extract, Ascorbic Acid, Tocopherol Rich Extract, Citric Acid)'];
    productInfo.allergens = ['Gluten', 'Lactose', 'Milk', 'Pulses, beans & peas', 'Soya'];
    productInfo.dietaryInfo.vegan = true;
    productInfo.dietaryInfo.vegetarian = true;
    productInfo.dietaryInfo.glutenFree = false;
    productInfo.dietaryInfo.highProtein = true;
    productInfo.dietaryInfo.highFibre = false;
    
    productInfo.weight = '45g';
    productInfo.manufacturer = 'Walkers';
    productInfo.certifications = ['100% Great British Potatoes', 'Suitable for vegetarians'];
    productInfo.barcode = '05012005091407';
    productInfo.imageUrl = 'https://digitalcontent.api.tesco.com/v2/media/ghs/c744c0dc-6bb3-410b-a2ae-a2617db164a5/7a1c08b2-e472-4316-982b-6da5cf22acd7_98651787.jpeg?h=960&w=960';
  } else if (productInfo.name.toLowerCase().includes('mayo') || productInfo.name.toLowerCase().includes('hellman')) {
    productInfo.brand = 'Hellmans';
   
    productInfo.nutritionalInfo.servingSize = 'Per serving';
    productInfo.nutritionalInfo.calories = '101kcal';
    productInfo.nutritionalInfo.protein = '0.5';
    productInfo.nutritionalInfo.carbs = '0.5';
    productInfo.nutritionalInfo.fat = '11';
    productInfo.nutritionalInfo.fiber = '0.5';
    productInfo.nutritionalInfo.sugar = '0.5';
    
    productInfo.ingredients = ['Rapeseed oil (78%)', 'EGG & EGG yolk (7.9%)', 'water', 'spirit vinegar', 'sugar', 'salt', 'flavourings', 'lemon juice concentrate', 'antioxidant (calcium disodium EDTA)', 'paprika extract'];
    productInfo.allergens = ['Eggs', 'Seeds'];
    productInfo.dietaryInfo.vegan = false;
    productInfo.dietaryInfo.vegetarian = true;
    productInfo.dietaryInfo.glutenFree = true;
    productInfo.dietaryInfo.highProtein = false;
    productInfo.dietaryInfo.highFibre = false;
    
    productInfo.weight = '430ml';
    productInfo.manufacturer = 'Hellmans';
    productInfo.certifications = ['100% Free-range eggs'];
    productInfo.barcode = '05000184321057';
    productInfo.imageUrl = 'https://images.ctfassets.net/6jpeaipefazr/11po4yvSNnPfSvkV3v8KE4/842def2c31540b6aea429411f36d92ad/P11-8722700479475.jpg?w=1080&h=1080';
  }

  return productInfo;
}