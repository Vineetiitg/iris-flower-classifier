# Iris Flower Classifier

A complete Iris flower classification project built from the CSV dataset in this repo. It includes both a browser-based classifier and a Python machine learning training script.

## Browser App

The browser app:

- Loads the Iris dataset from `data/Iris.csv`
- Trains a lightweight k-nearest neighbors classifier in the browser
- Shows test-set accuracy after an 80/20 split
- Lets you enter flower measurements and predict the species

Open `index.html` through a local web server so the browser can fetch the dataset:

```bash
npx serve .
```

Or use any static file server you prefer.

## Python ML Script

The Python script trains a random forest classifier with a stratified train/test split:

```bash
pip install -r requirements.txt
python iris_flower_classification.py
```

The script writes:

- `outputs/metrics.json` for model accuracy, class metrics, and confusion matrix
- `models/iris_classifier.joblib` for the trained model

## Project structure

- `index.html` - main app page
- `styles.css` - UI styling
- `app.js` - dataset loading, model training, and prediction logic
- `iris_flower_classification.py` - Python model training script
- `requirements.txt` - Python dependencies
- `data/Iris.csv` - dataset extracted from the provided archive

## Dataset

The project uses the standard Iris measurements:

- Sepal length
- Sepal width
- Petal length
- Petal width

The species classes are:

- Iris-setosa
- Iris-versicolor
- Iris-virginica
