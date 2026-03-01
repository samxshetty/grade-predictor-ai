from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_cgpa

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({'message': 'Student Grade Predictor API is running'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data received'}), 400
        
        result = predict_cgpa(data)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/whatif', methods=['POST'])
def whatif():
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data received'}), 400
        
        result = predict_cgpa(data)
        return jsonify({
            'predicted_cgpa': result['predicted_cgpa'],
            'grade': result['grade'],
            'risk_level': result['risk_level'],
            'risk_color': result['risk_color']
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)