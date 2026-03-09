export interface DiseaseInfo {
  name: string
  description: string
  symptoms: string[]
  treatment: string[]
  prevention: string[]
}

export const diseaseDatabase: Record<string, DiseaseInfo> = {
  'Apple___Apple_scab': {
    name: 'Apple Scab',
    description: 'Apple scab is a fungal disease caused by Venturia inaequalis that affects apple trees, causing dark, scabby lesions on leaves and fruit.',
    symptoms: [
      'Olive-green to brown spots on leaves',
      'Velvety or fuzzy texture on spots',
      'Yellowing and dropping of leaves',
      'Scabby, corky spots on fruit'
    ],
    treatment: [
      'Apply fungicides containing captan or myclobutanil',
      'Remove and destroy infected leaves and fruit',
      'Prune trees to improve air circulation',
      'Apply lime sulfur during dormant season'
    ],
    prevention: [
      'Plant resistant apple varieties',
      'Maintain proper tree spacing',
      'Clean up fallen leaves in autumn',
      'Apply preventive fungicide sprays in spring'
    ]
  },
  'Apple___Black_rot': {
    name: 'Apple Black Rot',
    description: 'Black rot is a fungal disease caused by Botryosphaeria obtusa that affects apples, causing fruit rot, leaf spots, and cankers on branches.',
    symptoms: [
      'Brown leaf spots with purple borders',
      'Large brown rotten areas on fruit',
      'Fruit mummifies and turns black',
      'Cankers on branches and trunk'
    ],
    treatment: [
      'Remove mummified fruit and cankers',
      'Apply fungicides during bloom',
      'Prune infected branches 6 inches below visible infection',
      'Improve tree vigor through proper fertilization'
    ],
    prevention: [
      'Remove all mummified fruit from trees and ground',
      'Prune out dead wood annually',
      'Maintain tree health through proper care',
      'Apply dormant sprays'
    ]
  },
  'Corn_(maize)___Common_rust_': {
    name: 'Corn Common Rust',
    description: 'Common rust is a fungal disease caused by Puccinia sorghi that affects corn leaves, producing characteristic rust-colored pustules.',
    symptoms: [
      'Small, circular to elongated brown pustules',
      'Pustules appear on both leaf surfaces',
      'Severe infections cause leaf yellowing',
      'Reduced photosynthesis and yield'
    ],
    treatment: [
      'Apply fungicides containing triazoles or strobilurins',
      'Remove heavily infected plant debris',
      'Scout fields regularly for early detection',
      'Time fungicide applications preventatively'
    ],
    prevention: [
      'Plant rust-resistant corn hybrids',
      'Avoid late planting',
      'Rotate crops to reduce inoculum',
      'Monitor weather conditions favorable for rust'
    ]
  },
  'Potato___Early_blight': {
    name: 'Potato Early Blight',
    description: 'Early blight is a fungal disease caused by Alternaria solani that affects potato and tomato plants, causing characteristic target-spot lesions.',
    symptoms: [
      'Dark brown spots with concentric rings (target spots)',
      'Lesions often start on lower leaves',
      'Yellowing of tissue around spots',
      'Premature leaf drop'
    ],
    treatment: [
      'Apply fungicides containing chlorothalonil or mancozeb',
      'Remove and destroy infected plant material',
      'Maintain adequate plant nutrition',
      'Ensure proper irrigation practices'
    ],
    prevention: [
      'Use certified disease-free seed potatoes',
      'Practice crop rotation (3-year minimum)',
      'Avoid overhead irrigation',
      'Maintain proper plant spacing for air circulation'
    ]
  },
  'Tomato___Late_blight': {
    name: 'Tomato Late Blight',
    description: 'Late blight is a devastating disease caused by Phytophthora infestans that can rapidly destroy tomato and potato crops under cool, wet conditions.',
    symptoms: [
      'Water-soaked spots on leaves that turn brown',
      'White fuzzy growth on leaf undersides',
      'Dark brown lesions on stems',
      'Firm, brown rot on fruit'
    ],
    treatment: [
      'Apply fungicides containing copper or chlorothalonil immediately',
      'Remove and destroy all infected plants',
      'Avoid working in wet fields',
      'Consider removing entire crop if severe'
    ],
    prevention: [
      'Plant resistant varieties when available',
      'Provide good air circulation',
      'Avoid overhead irrigation',
      'Monitor weather conditions and apply preventive fungicides'
    ]
  },
  'Healthy': {
    name: 'Healthy Plant',
    description: 'Your plant appears to be healthy with no signs of disease. Continue with good agricultural practices to maintain plant health.',
    symptoms: ['No disease symptoms detected'],
    treatment: ['No treatment necessary - plant is healthy'],
    prevention: [
      'Continue regular monitoring',
      'Maintain proper watering schedule',
      'Ensure adequate nutrition',
      'Practice crop rotation'
    ]
  }
}

export function getRandomDisease(): string {
  const diseases = Object.keys(diseaseDatabase)
  return diseases[Math.floor(Math.random() * diseases.length)]
}
