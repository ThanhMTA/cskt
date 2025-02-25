export const checkIsValidEquipmentCode = (
  child_code: string,
  parent_code: string,
  tree_level: number
) => {
  console.log("child_code: ", child_code);
  console.log("parent_code: ", parent_code);
  console.log("tree_level: ", tree_level);
  // A.6.00.00.00.00.000
  // A.0.00.00.00.00.000
  const child_code_arr = child_code.split(".");
  const parent_code_arr = parent_code.split(".");
  let isValid = true;
  if (child_code_arr.length !== parent_code_arr.length) {
    return false;
  }
  // sua nhu nay thi dc treeLevel 3
  // K.1.00.00.00.00.000
  // K.1.01.00.00.00.000
  // K.1.02.00.00.00.000
  for (let i = 0; i < child_code_arr.length; i++) {
    if (i < tree_level) {
      if (i !== tree_level) {
        if (child_code_arr[i] !== parent_code_arr[i]) {
          isValid = false;
          break;
        }
      } else {
        if (child_code_arr[i]?.length !== parent_code_arr[i]?.length) {
          isValid = false;
          break;
        }
      }
    }
  }
  return isValid;
};
