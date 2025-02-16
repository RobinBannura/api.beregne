from flask import Flask, render_template, jsonify, request
from decimal import Decimal
import os

app = Flask(__name__)


def format_currency(amount):
    # Format currency without relying on locale
    return f"{amount:,.0f} kr".replace(",", " ")


@app.route('/boliglan')
def boliglan():
    if request.headers.get('Accept', '').find('application/json') != -1:
        # Return JSON response
        return jsonify({
            "belop": "3 000 000 kr",
            "rente": "3.5%",
            "aar": "20 år",
            "manedlig_betaling": "14 900 kr"
        })
    # Return HTML response
    return render_template('boliglan.html')


@app.route('/maling')
def maling():
    if request.headers.get('Accept', '').find('application/json') != -1:
        return jsonify({
            "message": "Malekalkulator kommer snart"
        })
    return render_template('maling.html')


@app.route('/investering')
def investering():
    if request.headers.get('Accept', '').find('application/json') != -1:
        return jsonify({
            "message": "Investeringskalkulator kommer snart"
        })
    return render_template('investering.html')


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port)