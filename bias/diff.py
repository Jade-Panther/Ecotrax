import numpy as np


def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_deriv(x):
    s = sigmoid(x)
    return s * (1 - s)

class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        np.random.seed(42)

        self.w1 = np.random.randn(input_size, hidden_size)
        self.b1 = np.zeros(hidden_size)

        self.w2 = np.random.randn(hidden_size, output_size)
        self.b2 = np.zeros(output_size)

    def forward(self, x):
        self.z1 = np.dot(x, self.w1) + self.b1
        self.a1 = sigmoid(self.z1)

        self.z2 = np.dot(self.a1, self.w2) + self.b2
        self.a2 = sigmoid(self.z2)

        return self.a2

    def backward(self, x, y, lr):
        # output layer
        error = self.a2 - y
        d_z2 = error * sigmoid_deriv(self.z2)

        d_w2 = np.dot(self.a1.reshape(-1,1), d_z2.reshape(1,-1))
        d_b2 = d_z2

        # hidden layer
        d_a1 = np.dot(self.w2, d_z2)
        d_z1 = d_a1 * sigmoid_deriv(self.z1)

        d_w1 = np.dot(x.reshape(-1,1), d_z1.reshape(1,-1))
        d_b1 = d_z1

        # update
        self.w1 -= lr * d_w1
        self.b1 -= lr * d_b1
        self.w2 -= lr * d_w2
        self.b2 -= lr * d_b2

    def train(self, X, y, epochs=5000, lr=0.1):
        for epoch in range(epochs):
            for i in range(len(X)):
                self.forward(X[i])
                self.backward(X[i], y[i], lr)

            if epoch % 500 == 0:
                loss = np.mean((self.forward(X) - y) ** 2)
                print(f"Epoch {epoch}, Loss: {loss:.4f}")

    def predict(self, X):
        return self.forward(X)



inputs = np.array([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
])

targets = np.array([
    [0],
    [1],
    [1],
    [0]
])


nn = NeuralNetwork(input_size=2, hidden_size=4, output_size=3)
nn.train(inputs, targets)


print("\nPredictions:")
for x in inputs:
    print(x, "->", nn.predict(x))