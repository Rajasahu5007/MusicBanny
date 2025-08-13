
class PowerOfTwoMaxHeap {
    constructor(x) {
        this.heap = [];
        this.numChildren = Math.pow(2, x); // 2^x children per parent
    }

    // Helper method to get the parent index of a node
    getParentIndex(i) {
        return Math.floor((i - 1) / this.numChildren);
    }

    // Helper method to get the children indices of a node
    getChildrenIndices(i) {
        const childrenIndices = [];
        for (let j = 1; j <= this.numChildren; j++) {
            const childIndex = this.numChildren * i + j;
            if (childIndex < this.heap.length) {
                childrenIndices.push(childIndex);
            }
        }
        return childrenIndices;
    }

    // Method to bubble up the element at index i
    bubbleUp(i) {
        while (i > 0) {
            const parentIndex = this.getParentIndex(i);
            if (this.heap[i] > this.heap[parentIndex]) {
                // Swap the elements
                [this.heap[i], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[i]];
                i = parentIndex; // Continue to bubble up
            } else {
                break;
            }
        }
    }

    // Method to bubble down the element at index i
    bubbleDown(i) {
        while (i < this.heap.length) {
            const childrenIndices = this.getChildrenIndices(i);
            if (childrenIndices.length === 0) break;

            // Find the largest child
            let largestChildIndex = childrenIndices[0];
            for (const childIndex of childrenIndices) {
                if (this.heap[childIndex] > this.heap[largestChildIndex]) {
                    largestChildIndex = childIndex;
                }
            }

            // If the largest child is larger than the current element, swap them
            if (this.heap[largestChildIndex] > this.heap[i]) {
                [this.heap[i], this.heap[largestChildIndex]] = [this.heap[largestChildIndex], this.heap[i]];
                i = largestChildIndex; // Continue to bubble down
            } else {
                break;
            }
        }
    }

    // Insert method
    insert(value) {
        this.heap.push(value); // Add the value at the end of the heap
        this.bubbleUp(this.heap.length - 1); // Bubble it up to restore heap property
    }

    // Pop max method
    popMax() {
        if (this.heap.length === 0) {
            return null; // Heap is empty
        }
        const maxValue = this.heap[0]; // The root is the max value
        const lastValue = this.heap.pop(); // Remove the last value
        if (this.heap.length > 0) {
            this.heap[0] = lastValue; // Move the last value to the root
            this.bubbleDown(0); // Bubble down the root to restore heap property
        }
        return maxValue;
    }

    // Method to print the heap (for debugging purposes)
    printHeap() {
        console.log(this.heap.join(" "));
    }
}

// Testing the heap
const heap = new PowerOfTwoMaxHeap(2); // 2^2 = 4 children per parent

// Insert some values
heap.insert(10);
heap.insert(15);
heap.insert(20);
heap.insert(30);

// Print the heap
heap.printHeap(); // Expected output: 30 15 20 10

// Pop the max (root)
console.log("Popped max: " + heap.popMax()); // Expected output: 30

// Print the heap after popping max
heap.printHeap(); // Expected output: 20 15 10

// Pop another max
console.log("Popped max: " + heap.popMax()); // Expected output: 20

// Print the heap after popping max
heap.printHeap(); // Expected output: 15 10
