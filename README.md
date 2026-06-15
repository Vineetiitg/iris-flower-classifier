# Iris Flower Classifier

A complete Iris flower classification project built from the CSV dataset in this repo.

## What it does

- Loads the Iris dataset from `data/Iris.csv`
- Trains a lightweight k-nearest neighbors classifier in the browser
- Shows test-set accuracy after an 80/20 split
- Lets you enter flower measurements and predict the species

## Project structure

- `index.html` - main app page
- `styles.css` - UI styling
- `app.js` - dataset loading, model training, and prediction logic
- `data/Iris.csv` - dataset extracted from the provided archive

## Run locally

Open `index.html` through a local web server so the browser can fetch the dataset:

```bash
npx serve .
```

Or use any static file server you prefer.

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
