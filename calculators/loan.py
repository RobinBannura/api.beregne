def loan_calculator(amount, interest, years):
    """ Enkel lånekalkulator """
    monthly_rate = (interest / 100) / 12
    months = years * 12
    if monthly_rate == 0:
        monthly_payment = amount / months
    else:
        monthly_payment = (amount * monthly_rate) / (1 - (1 + monthly_rate) ** -months)
    
    return {
        "loan_amount": amount,
        "interest_rate": interest,
        "years": years,
        "monthly_payment": round(monthly_payment, 2)
    }