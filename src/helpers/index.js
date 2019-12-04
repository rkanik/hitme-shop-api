
exports.getSubWords = str => {
   let arr = str.split(" ");

   let newA = [];
   newA.push(str);

   arr.forEach((word, index) => {
      let sStr = "";
      for (let i = 0; i < arr.indexOf(word); i++) {
         if (index != i) sStr += `${arr[i]} `;
      }
      newA.push(sStr.trim());
   });

   arr.forEach((_, index) => {
      let sStr = "";
      for (let i = index + 1; i < arr.length; i++) {
         sStr += ` ${arr[i]}`;
      }
      newA.push(sStr.trim());
   });

   return newA.filter(a => a !== "");
};
