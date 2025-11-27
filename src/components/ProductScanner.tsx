import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, AlertCircle, Loader2, Check, Edit3, Info } from 'lucide-react';
import { ProductInfo } from '../types';
import { analyzeImage } from '../lib/vision-api';
import { cacheProduct } from '../lib/product-storage';
import { useHealthProfile } from '../contexts/HealthProfileContext';
import ImageCarousel from "./ImageCarousel";

interface ProductScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductDetected: (product: ProductInfo) => void;
}

export function ProductScanner({ isOpen, onClose, onProductDetected }: ProductScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [flash, setFlash] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [detectedProduct, setDetectedProduct] = useState<ProductInfo | null>(null);
  const { profile } = useHealthProfile();

  const getCarouselItems = (product: ProductInfo | null, isHealthCompatible: bool | True) => {
    if (!product) return [];
    if (isHealthCompatible) {
      if (product.name.toLowerCase().includes('bean')) {
        return [
          {
            image: "https://digitalcontent.api.tesco.com/v2/media/ghs/32ec6d72-f891-49e5-9691-dabe818c765c/eadfb578-e544-40cf-b925-742341ffe583_157935068.jpeg?h=960&w=960",
            caption: "Heinz Baked Beans No Added Sugar 200G",
          },
          {
            image: "https://digitalcontent.api.tesco.com/v2/media/ghs/03e39308-9ada-4d63-ba4d-146da7190d30/a2d6b1bd-5c36-44c9-8192-e739ebd4ba0f_1926784509.jpeg?h=960&w=960",
            caption: "Heinz Baked Beans Five Beanz In Tomato Sauce 415G",
          },
          {
            image: "https://digitalcontent.api.tesco.com/v2/media/ghs/2753a541-52ad-4947-bf86-e893ea4a5f60/dc2b4305-885f-431c-a05e-c6fc3feee2b9_2131876386.jpeg?h=960&w=960",
            caption: "Tesco Baked Beans In Tomato Sauce 220g",
          }
        ];
      } else if (product.name.toLowerCase().includes('kit')) {
        return [
          {
            image: "https://www.kitkat.co.uk/sites/default/files/styles/full_width_image_1920x795_/public/2024-09/KK-4F-dark-fop.png?itok=2xS2CGFA",
            caption: "Kitkat 4 Finger Dark Chocolate",
          },
          {
            image: "https://digitalcontent.api.tesco.com/v2/media/ghs/03e39308-9ada-4d63-ba4d-146da7190d30/a2d6b1bd-5c36-44c9-8192-e739ebd4ba0f_1926784509.jpeg?h=960&w=960",
            caption: "Heinz Baked Beans Five Beanz In Tomato Sauce 415G",
          },
          {
            image: "https://digitalcontent.api.tesco.com/v2/media/ghs/ee454895-8935-4e19-a536-a128ce1f8fa7/938dfa57-8f7c-41b5-a95f-a8d9d32724be_65993902.jpeg?h=960&w=960",
            caption: "Tesco Baked Beans In Tomato Sauce 220g",
          }
        ];
      } else if (product.name.toLowerCase().includes('walker')) {
        return [
          {
            image: "https://s3-eu-west-1.amazonaws.com/glencrest/i/pmi/6532_main.jpg?_t=22126122642",
            caption: "Walkers Baked Salt & Vinegar",
          },
          {
            image: "https://assets.wedeliverlocal.co.uk/cdn/products/10233027-unw.jpg?w=350",
            caption: "Walkers Baked Ready Salted Crisps",
          },
          {
            image: "https://d15m7jcmnw9usb.cloudfront.net/img/sunbites-veggie-harvest-onion--vinegar-snacks-6x25g.jpeg",
            caption: "Sunbites Roasted Onion & Tumeric",
          }
        ];
      } else if (product.name.toLowerCase().includes('mayo') || product.name.toLowerCase().includes('hellman')) {
        return [
          {
            image: "https://digitalcontent.api.tesco.com/v2/media/ghs/126b23ab-2f4c-4c85-b65b-483ffc7c5f3f/452f429c-22d3-4ff0-9503-02c94a4a76dd_379325731.jpeg?h=960&w=960",
            caption: "Hellmann's Light Mayonnaise Jar",
          },
          {
            image: "https://digitalcontent.api.tesco.com/v2/media/ghs/2f305b0c-50d8-46b1-9f17-83575886bc68/30ec5fe0-0307-4861-9950-59accf9446f5_1434442420.jpeg?h=960&w=960",
            caption: "Tesco Light Mayonniase",
          },
          {
            image: "https://digitalcontent.api.tesco.com/v2/media/ghs/317a6316-3a52-4480-afaa-0db112f34e3a/97fb8c48-bdfc-476a-8525-4a8d26a50e77_964234945.jpeg?h=225&w=225",
            caption: "Heinz Seriously Good mayonniase Light",
          }
        ];
      }
      return [];
    } else {
      if (product.name.toLowerCase().includes('mayo') || product.name.toLowerCase().includes('hellman')) {
        return [
          {
            image: "https://digitalcontent.api.tesco.com/v2/media/ghs/bf542922-fa18-4d20-a715-ce59f15add0b/c4aa9e9f-9c01-47a9-89a5-08cdd78749ac_1753444355.jpeg?h=960&w=960",
            caption: "Heinz Seriously Good Vegan Mayonnaise",
          },
          {
            image: "https://britishessentials.com/cdn/shop/files/635188011_0_640x640_4117760d-d458-46a3-8373-5b2ff66c1185_grande.jpg?v=1747214464",
            caption: "`Hellmann's Plant Based Mayo`",
          },
          {
            image: "https://m.media-amazon.com/images/I/71mIMNmS9BL.jpg",
            caption: "Only! Plant based Vegan Mayonnaise",
          }
        ];
      } return []
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: window.innerWidth },
            height: { ideal: window.innerHeight }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Check if flash is available
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        setHasFlash('torch' in capabilities);

      } catch (err) {
        setError('Unable to access camera. Please ensure camera permissions are granted.');
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const toggleFlash = async () => {
    if (!videoRef.current?.srcObject) return;

    const track = (videoRef.current.srcObject as MediaStream).getVideoTracks()[0];
    const newFlashState = !flash;

    try {
      await track.applyConstraints({
        advanced: [{ torch: newFlashState }]
      });
      setFlash(newFlashState);
    } catch (err) {
      setError('Unable to toggle flash');
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg');
  };

  const scanProduct = async () => {
    setScanning(true);
    setError(null);

    try {
      const frame = captureFrame();
      if (!frame) {
        throw new Error('Failed to capture image. Please try again.');
      }

      const product = await analyzeImage(frame);
      
      if (!product) {
        throw new Error('Failed to analyze product. Please try again with better lighting and a clearer view of the product.');
      }

      cacheProduct(product);
      setDetectedProduct(product);
      onProductDetected(product);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan product';
      
      if (errorMessage === 'VISION_API_UNAVAILABLE') {
        setError('Product scanning is currently unavailable. You can manually enter product details instead.');
      } else if (errorMessage.includes('Invalid image data')) {
        setError('Failed to capture image. Please ensure good lighting and try again.');
      } else if (errorMessage.includes('API Error')) {
        setError('Unable to scan product. Please try manual entry or try again later.');
      } else {
        setError('Unable to scan product. Please try manual entry or try again later.');
      }
    } finally {
      setScanning(false);
    }
  };

  const checkHealthCompatibility = () => {
    if (!profile || !detectedProduct) return null;
   
    const issues: string[] = [];

    if (profile.dietType === 'vegetarian' && !detectedProduct.dietaryInfo.vegetarian) {
      issues.push('This product is not suitable for vegetarians');
    }
    if (profile.dietType === 'vegan' && !detectedProduct.dietaryInfo.vegan) {
      issues.push('This product is not suitable for vegans');
    }
    if (profile.isOnGLP1 && !(detectedProduct.dietaryInfo.highProtein && detectedProduct.dietaryInfo.highFibre)) {
      issues.push('This product is not suitable for GLP1');
    }

    const userAllergens = new Set(profile.allergies.map(a => a.toLowerCase()));
    const productAllergens = new Set(detectedProduct.allergens.map(a => a.toLowerCase()));
    const allergensFound = [...userAllergens].filter(allergen => 
      [...productAllergens].some(productAllergen => 
        productAllergen.includes(allergen) || allergen.includes(productAllergen)
      )
    );
    
    if (allergensFound.length > 0) {
      issues.push(`Contains allergens you're sensitive to: ${allergensFound.join(', ')}`);
    }

    const customRestrictions = new Set(profile.customRestrictions.map(r => r.toLowerCase()));
    const ingredientsLower = detectedProduct.ingredients.map(i => i.toLowerCase());
    const restrictionsFound = [...customRestrictions].filter(restriction =>
      ingredientsLower.some(ingredient => ingredient.includes(restriction))
    );

    if (restrictionsFound.length > 0) {
      issues.push(`Contains restricted ingredients: ${restrictionsFound.join(', ')}`);
    }

    if (profile.restrictions.includes('gluten-free') && !detectedProduct.dietaryInfo.glutenFree) {
      issues.push('This product is not gluten-free');
    }

    return issues;
  };

  const stopScanner = () => {
    setScanning(false);
    setDetectedProduct(null);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  if (!isOpen) return null;

  const healthIssues = checkHealthCompatibility();
  const isHealthCompatible = !healthIssues || healthIssues.length === 0;
  const carouselItems = getCarouselItems(detectedProduct, isHealthCompatible);

  return (
    <>
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Camera View */}
        <div className="relative flex-1">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white rounded-lg">
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Error Message with Manual Entry Option */}
          {error && (
            <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="mb-2">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      onClose();
                    }}
                    className="text-sm bg-white text-red-500 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Enter Product Details Manually
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black to-transparent">
            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={scanProduct}
                disabled={scanning}
                className="p-6 rounded-full bg-white text-racing hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                <Camera className="w-8 h-8" />
              </button>

              {hasFlash && (
                <button
                  onClick={toggleFlash}
                  className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
                    flash ? 'bg-white text-racing' : 'bg-white/10 text-white'
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">⚡️</div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Detected Product */}
        {detectedProduct && (
          <div className="absolute inset-0 bg-white">
            <div className="h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-racing">Scanned Product</h2>
                  <button
                    onClick={handleClose}
                    className="p-2 text-racing-50 hover:text-racing rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Health Compatibility Alert */}
                {profile && (
                  <div className={`mb-6 p-4 rounded-xl ${
                    isHealthCompatible 
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}>
                    <div className="flex items-start gap-3">
                      {isHealthCompatible ? (
                        <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">
                          {isHealthCompatible 
                            ? 'This product is compatible with your health profile'
                            : 'This product may not be suitable for you'}
                        </p>
                        {!isHealthCompatible && healthIssues && healthIssues.length > 0 && (
                          <ul className="mt-2 space-y-1 text-sm">
                            {healthIssues.map((issue, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span>•</span>
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Image */}
                <div className="mb-6 flex justify-center">
                  <img
                    src={detectedProduct.imageUrl}
                    alt={detectedProduct.name}
                    className="max-w-xs h-48 object-contain rounded-xl shadow-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-2xl font-bold text-racing mb-1">
                      {detectedProduct.name}
                    </h3>
                    <p className="text-racing-75">{detectedProduct.brand}</p>
                  </div>

                  {/* Dietary Tags */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(detectedProduct.dietaryInfo).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <span
                          key={key}
                          className="px-3 py-1 rounded-full bg-primary text-racing text-sm font-medium"
                        >
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      );
                    })}
                  </div>

                  {/* Nutritional Info */}
                  <div>
                    <h4 className="font-semibold text-racing mb-3">Nutrition Facts</h4>
                    <div className="bg-primary-25 rounded-xl p-4">
                      <div className="text-sm text-racing-75 mb-2">
                        Serving Size: {detectedProduct.nutritionalInfo.servingSize}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Calories</span>
                          <span>{detectedProduct.nutritionalInfo.calories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Protein</span>
                          <span>{detectedProduct.nutritionalInfo.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Carbohydrates</span>
                          <span>{detectedProduct.nutritionalInfo.carbs}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Fat</span>
                          <span>{detectedProduct.nutritionalInfo.fat}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Fiber</span>
                          <span>{detectedProduct.nutritionalInfo.fiber}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Sugar</span>
                          <span>{detectedProduct.nutritionalInfo.sugar}g</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h4 className="font-semibold text-racing mb-3">Ingredients</h4>
                    <p className="text-racing-75">
                      {detectedProduct.ingredients.join(', ')}
                    </p>
                  </div>

                  {/* Allergens */}
                  {detectedProduct.allergens.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-racing mb-3">Allergen Warning</h4>
                      <div className="bg-azure/20 text-racing rounded-xl p-4">
                        <ul className="list-disc list-inside space-y-1">
                          {detectedProduct.allergens.map((allergen, index) => (
                            <li key={index}>{allergen}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {detectedProduct.certifications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-racing mb-3">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {detectedProduct.certifications.map((cert, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-primary-25 text-racing text-sm"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-racing-50">Weight/Volume</span>
                      <p className="text-racing">{detectedProduct.weight}</p>
                    </div>
                    <div>
                      <span className="text-sm text-racing-50">Manufacturer</span>
                      <p className="text-racing">{detectedProduct.manufacturer}</p>
                    </div>
                    <div>
                      <span className="text-sm text-racing-50">Barcode</span>
                      <p className="text-racing">{detectedProduct.barcode}</p>
                    </div>
                  </div>

                  {/* Edit Button */}
                  {/* <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-racing text-white rounded-xl hover:bg-racing-75 transition-colors"> */}
                    {/* <Edit3 className="w-5 h-5" /> */}
                    {/* <span>Edit Product Information</span> */}
                  {/* </button> */}

                  {/* Product Carousel */}
                  <div className="flex flex-col items-center mt-10">
                    <p className="text-2xl font-bold mb-4">
                      {isHealthCompatible 
                        ? "Explore other healthier options"
                        : "Similar products suitable for you!"
                      }</p>
                    <ImageCarousel items={carouselItems} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}