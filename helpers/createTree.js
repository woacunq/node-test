function createTree(arr, parentId = "") {
  const tree = [];
  
  arr.forEach((item) => {
    const currentId = item.id || item._id.toString();
    
    if (item.parent_id === parentId) {
      const newItem = item._doc 
        ? { ...item._doc, id: currentId } 
        : { ...item, id: currentId };
    
      const children = createTree(arr, currentId);
      
      if (children.length > 0) {
        newItem.children = children;
      }
      
      tree.push(newItem);
    }
  });
  
  return tree;
}

module.exports.tree = (arr, parentId = "") => {
  const tree = createTree(arr, parentId);
  return tree;
};