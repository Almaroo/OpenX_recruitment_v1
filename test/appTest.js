const assert = require("chai").assert;
const Node = require("../app").Node;
const getSubtreeStatistics = require("../app").getSubtreeStatistics;

describe("Tests for Node object creation", () => {
  it("Simple object creation", () => {
    let testNode = new Node();
    assert.isObject(testNode, "Test Node is not an object");
  });

  it("Value of an Node without specified value", () => {
    let testNode = new Node();
    assert.equal(testNode.getValue(), 0, "Value is not 0");
  });

  it("Children property is an array", () => {
    let testNode = new Node();
    assert.isArray(testNode.getChildren(), "children is not an Array");
  });

  it("Value of an Node with specified value", () => {
    let testNode = new Node(4);
    assert.equal(testNode.getValue(), 4, "Value is not 4");
  });

  it("Node nesting", () => {
    let testNode1 = new Node(4);
    let testNode2 = new Node(3, testNode1);

    assert.equal(testNode1.getParent(), testNode2, "Node parent is incorrect");
    assert.equal(
      testNode2.getChildren()[0],
      testNode1,
      "Node child is incorrect"
    );
  });

  it("Input validation", () => {
    let testNode = new Node(4, 5, "whatever");

    assert.lengthOf(testNode.getChildren(), 0, "children array is not empty");
  });

  it("Value rounding", () => {
    let testNode1 = new Node(0.2);
    let testNode2 = new Node(4.65);
    let testNode3 = new Node(-3.1416);

    assert.equal(testNode1.getValue(), 0, "Value is not 0");
    assert.equal(testNode2.getValue(), 5, "Value is not 5");
    assert.equal(testNode3.getValue(), -3, "Value is not -3");
  });
});

describe("Tests for functions inside getSubtreeStatistics closure", () => {
  it("Test of test mode", () => {
    assert.isFunction(
      getSubtreeStatistics(null, 1).initialize,
      "Test mode is not working"
    );
  });

  it("Test of initialize function", () => {
    getSubtreeStatistics(null, 1).subset = ["a", 5, { a: 1, b: 2 }];
    getSubtreeStatistics(null, 1).initialize();

    assert.lengthOf(
      getSubtreeStatistics(null, 1).subset,
      0,
      "Subset is not empty"
    );
  });

  it("Test of calculateMedian function", () => {
    let subset1 = [1, 2, 3, 4, 5];
    let subset2 = [1, 2, 3, 4, 5, 6];
    let subset3 = [1];

    assert.equal(
      getSubtreeStatistics(null, 1).calculateMedian(subset1),
      3,
      "Median is not equal 3"
    );
    assert.equal(
      getSubtreeStatistics(null, 1).calculateMedian(subset2),
      3.5,
      "Median is not equal 3.5"
    );
    assert.equal(
      getSubtreeStatistics(null, 1).calculateMedian(subset3),
      1,
      "Median is not equal 1"
    );
  });

  it("Test of sumUpSubtree function", () => {
    let Node1 = new Node(1);
    let Node2 = new Node(2, Node1);
    let Node3 = new Node(12);
    let Node4 = new Node(0, Node2, Node3);

    assert.sameOrderedMembers(
      getSubtreeStatistics(null, 1).sumUpSubtree(Node4),
      [0, 2, 1, 12],
      "Array is not as expected"
    );
  });
});

describe("Test of getSubtreeStatistics function", () => {
  const Node10 = new Node(5);
  const Node9 = new Node(8, Node10);
  const Node8 = new Node(2);
  const Node7 = new Node(0, Node8, Node9);
  const Node6 = new Node(1);
  const Node5 = new Node(5);
  const Node4 = new Node(2);
  const Node3 = new Node(7, Node6, Node7);
  const Node2 = new Node(3, Node4, Node5);
  const Node1 = new Node(5, Node2, Node3);

  it("Test without parameter", () => {
    let result = getSubtreeStatistics();
    assert.containsAllKeys(
      result,
      ["sum", "arithmetic_mean", "median"],
      "result does not contain full answer"
    );
    assert.equal(result.sum, 0, "Sum is not equal 0");
    assert.equal(result.arithmetic_mean, 0, "Arithmetic mean is not equal 0");
    assert.equal(result.median, 0, "Median is not equal 0");
  });

  it("Test of empty node", () => {
    let result = getSubtreeStatistics(new Node());
    assert.containsAllKeys(
      result,
      ["sum", "arithmetic_mean", "median"],
      "result does not contain full answer"
    );
    assert.equal(result.sum, 0, "Sum is not equal 0");
    assert.equal(result.arithmetic_mean, 0, "Arithmetic mean is not equal 0");
    assert.equal(result.median, 0, "Median is not equal 0");
  });

  it("Test of node10", () => {
    let result = getSubtreeStatistics(Node10);
    assert.containsAllKeys(
      result,
      ["sum", "arithmetic_mean", "median"],
      "result does not contain full answer"
    );
    assert.equal(result.sum, 5, "Sum is not equal 5");
    assert.equal(result.arithmetic_mean, 5, "Arithmetic mean is not equal 5");
    assert.equal(result.median, 5, "Median is not equal 5");
  });

  it("Test of the whole tree", () => {
    let result = getSubtreeStatistics(Node1);
    assert.containsAllKeys(
      result,
      ["sum", "arithmetic_mean", "median"],
      "result does not contain full answer"
    );
    assert.equal(result.sum, 38, "Sum is not equal 38");
    assert.equal(
      result.arithmetic_mean,
      3.8,
      "Arithmetic mean is not equal 38"
    );
    assert.equal(result.median, 4, "Median is not equal 4");
  });
});
