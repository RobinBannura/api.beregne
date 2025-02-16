from flask import Flask, jsonify
from calculators.loan import loan_calculator

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Velkommen til Beregne API!"})

@app.route('/loan', methods=['GET'])
def loan():
    return jsonify(loan_calculator(1000000, 3.5, 20))  # Eksempeldata

if __name__ == '__main__':
    app.run(debug=True)