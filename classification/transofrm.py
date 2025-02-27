from	transformers import pipeline

#Load a zero-shot classification pipeline
		classifier = pipeline("zero-shot-classification", model = "facebook/bart-large-mnli")

#Define candidate intents
candidate_labels =["Account_Balance", "Payment_Status", "General_Info", "Account_Help"]

#User query
query = "Where is my payment?"

#Predict the intentd
result = classifier(query, candidate_labels)
predicted_intent = result["labels"][0]
print(f "Predicted Intent: {predicted_intent}")
