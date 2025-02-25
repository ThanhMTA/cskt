import { Knex } from "knex";

export async function generateNewCodeOrg(code: string, knex: Knex) {
  try {
    let newCode;
    console.log("code: ", code);
    // 43.09.05.03.00.00
    if (code && code.length > 0) {
      const arrCode = code.split(".");
      console.log("arrCode: ", arrCode);
      const arrLast = [];
      for (let i = arrCode.length - 1; i >= 0; i--) {
        if (
          parseInt(arrCode[i] || "") !== 0 ||
          isNaN(parseInt(arrCode[i] || ""))
        ) {
          const index = arrCode.reduce((acc, currentValue, currentIndex) => {
            if (currentIndex <= i) {
              return acc + currentValue.length + 1;
            }
            return acc + 0;
          }, 0);
          const maxOfLevel = "9".repeat(arrCode[i + 1]?.length || 1);
          const zeroStr = "0".repeat(arrCode[i + 1]?.length || 1);
          console.log("maxOfLevel: ", maxOfLevel);
          console.log("zeroStr: ", zeroStr);
          console.log("index: ", index);
          console.log("code: ", code.slice(0, index));
          // const selectSql = knex.raw(`MAX(SUBSTRING(code, ?, ?)) AS maxlevel`, [
          //   index + 1,
          //   arrCode[i + 1]?.length,
          // ])
          // const whereSql =  knex.raw(`WHERE LEFT(code, ?) = ? AND SUBSTRING(code, ?, ?) <> ?`,[
          //   index, code.slice(0, index), index + 1,
          //   arrCode[i + 1]?.length,
          //   maxOfLevel,
          // ])
          console.log(
            "SQL: ",
            knex("organizations")
              .select(
                knex.raw(`MAX(SUBSTRING(code, ?, ?)) AS maxlevel`, [
                  index + 1,
                  arrCode[i + 1]?.length,
                ])
              )
              .whereRaw(`LEFT(code, ?) = ?`, [index, code.slice(0, index)])
              .andWhereRaw(`SUBSTRING(code, ?, ?) <> ?`, [
                index + 1,
                arrCode[i + 1]?.length,
                maxOfLevel,
              ])
              .toSQL()
          );
          let maxLevel = await knex.raw(
            knex("organizations")
              .select(
                knex.raw(`MAX(SUBSTRING(code, ?, ?)) AS maxlevel`, [
                  index + 1,
                  arrCode[i + 1]?.length,
                ])
              )
              .whereRaw(`LEFT(code, ?) = ?`, [index, code.slice(0, index)])
              .andWhereRaw(`SUBSTRING(code, ?, ?) <> ?`, [
                index + 1,
                arrCode[i + 1]?.length,
                maxOfLevel,
              ])
              .toQuery()
          );

          // let maxLevel = await knex("organizations")
          // .select(
          //   knex.raw(`MAX(SUBSTRING(code, ?, ?)) AS maxlevel`, [
          //     index + 1,
          //     arrCode[i + 1]?.length || 2,
          //   ])
          // )
          // .whereRaw(`LEFT(code, ?) = ?`, [index, code.slice(0, index)])
          // .andWhereRaw(`SUBSTRING(code, ?, ?) <> ?`, [
          //   index + 1,
          //   arrCode[i + 1]?.length || 2,
          //   maxOfLevel,
          // ])
          // .then((result: any) => {
          //   console.log("resul maxLevel: ", result);
          //   return result[0].maxlevel;
          // });

          console.log("maxLevel: ", maxLevel);
          maxLevel = maxLevel ? maxLevel?.rows[0].maxlevel : "00";
          // .then((result) => {
          //   console.log("rsult: ", result);
          //   return result[0].maxlevel;
          // });

          //   const maxLevel: any = await knex("organizations")
          //   .select()
          //   .whereRaw()
          // .then((result)=> result[0].maxlevel)

          // .select(knex.raw(selectSql))
          // .whereRaw(whereSqlLeft, code.slice(0, index))
          // .andWhereRaw(whereSqlSubStr, maxOfLevel)
          // .then((result: any) => {
          //   // console.log("resul maxLevel: ", result);
          //   return result[0].maxlevel;
          // });
          // console.log("maxLevel: ", maxLevel);

          newCode =
            code.slice(0, index) +
            zeroStr.slice(0, zeroStr.length - String(+maxLevel + 1).length) +
            String(+maxLevel + 1);
          if (i < arrCode.length && arrLast.length > 0) {
            // console.log("arrLast: ", arrLast);
            arrLast.shift();

            const lastCode = arrLast.length > 0 ? arrLast.join(".") : "";

            // console.log("newCode: ", newCode);
            if (lastCode !== "") {
              newCode = newCode + "." + lastCode;
            }
          }
          // console.log('newCode: ', newCode);
          break;
        } else {
          arrLast.unshift(arrCode[i]);
          //
        }
      }
    } else if (code === "") {
      const maxLevel1 = await knex("organizations")
        .select(knex.raw("MAX(SUBSTRING(code, 1, 2)) AS maxlevel1"))
        .whereRaw("SUBSTRING(code, 1, 2) <> ?", "99")
        .then((result) => result[0].maxlevel1);
      newCode =
        "00".slice(0, 2 - String(+maxLevel1 + 1).length) +
        String(+maxLevel1 + 1) +
        "." +
        "00.00.00.00.00";
    }

    return newCode;
  } catch (error) {
    console.error("Error generating new unit code:", error);
    return "";
  }
}

// Trước khi insert check trùng mã trong hệ thống
// Trc khi update neu co update code thi se check trong he thong neu co khong cho update

/**
 *
 * @param code
 * @param knex
 * @returns
 */

export async function generateNewCodeEquip(
  code: string,
  type: string,
  knex: Knex
) {
  try {
    let newCode;
    console.log("code: ", code);
    console.log("type: ", type);
    if (code && code.length > 0) {
      // Check level 6,7 => thêm nốt con level 7
      if (type.trim().toLowerCase() === "tb") {
        // K.0.00.00.00.00.000
        const arrCode = code.split(".");
        console.log("arrCode: ", arrCode);
        //
        // startIndex lay ra arrCode[0].length + ... arrCode[i].length + i
        const arrLast = [];
        for (let i = arrCode.length - 1; i >= 0; i--) {
          if (
            parseInt(arrCode[i] || "") !== 0 ||
            isNaN(parseInt(arrCode[i] || ""))
          ) {
            console.log("i : ", i);
            const index = arrCode.reduce((acc, currentValue, currentIndex) => {
              if (currentIndex <= i) {
                return acc + currentValue.length + 1;
              }
              return acc + 0;
            }, 0);
            console.log("index: ", index);
            const selectSql = `MAX(SUBSTRING(code, ${index + 1}, ${
              arrCode[i + 1]?.length
            })) AS maxlevel`;
            console.log("selectSql: ", selectSql);
            const maxOfLevel = "9".repeat(arrCode[i + 1]?.length || 1);
            console.log("maxOfLevel: ", maxOfLevel);
            const whereSqlLeft = `LEFT(code, ${index}) = ?`;
            console.log("whereSqlLeft: ", whereSqlLeft);
            const whereSqlSubStr = `SUBSTRING(code, ${index + 1}, ${
              arrCode[i + 1]?.length
            }) <> ?`;
            console.log("whereSqlSubStr: ", whereSqlSubStr);
            console.log("code.slice(0, index): ", code.slice(0, index));
            const zeroStr = "0".repeat(arrCode[i + 1]?.length || 1);
            const maxLevel = await knex("tbvt_categories")
              .select(knex.raw(selectSql))
              .whereRaw(whereSqlLeft, code.slice(0, index))
              .andWhereRaw(whereSqlSubStr, maxOfLevel)
              .andWhereRaw("type = ?", type)
              .then((result) => {
                console.log("result maxLevel: ", result);
                return result[0].maxlevel;
              });
            console.log("maxLevel: ", maxLevel);
            newCode =
              code.slice(0, index) +
              zeroStr.slice(0, zeroStr.length - String(+maxLevel + 1).length) +
              String(+maxLevel + 1);
            if (i < arrCode.length && arrLast.length > 0) {
              console.log("arrLast: ", arrLast);
              arrLast.shift();
              console.log("arrLastBefore: ", arrLast);
              const lastCode = arrLast.length > 0 ? arrLast.join(".") : "";
              console.log("lastCode: ", lastCode);
              console.log("newCode: ", newCode);
              if (lastCode !== "") {
                newCode = newCode + "." + lastCode;
              }
            }
            break;
          } else {
            arrLast.unshift(arrCode[i]);
            //
          }
        }
      } else {
        console.log("Type VT");
        // Q00.00.00.00.00.000
        // Q01.00.00.00.00.000
        // Q01.01.00.00.00.000
        // Q01.01.01.00.00.000
        // Q01.01.01.01.00.000
        // Q01.01.01.01.01.000
        // Q01.01.01.01.01.001
        // Q02.00.00.00.00.000
        const arrCode = code.split(".");
        console.log("arrCode: ", arrCode);

        // startIndex lay ra arrCode[0].length + ... arrCode[i].length + i
        const arrLast = [];
        for (let i = arrCode.length - 1; i >= 0; i--) {
          if (
            ((parseInt(arrCode[i] || "") !== 0 ||
              isNaN(parseInt(arrCode[i] || ""))) &&
              i !== 0) ||
            ((parseInt(arrCode[i]?.slice(1) || "") !== 0 ||
              isNaN(parseInt(arrCode[i]?.slice(1) || ""))) &&
              i == 0)
          ) {
            console.log("i : ", i);
            const index = arrCode.reduce((acc, currentValue, currentIndex) => {
              if (currentIndex <= i) {
                return acc + currentValue.length + 1;
              }
              return acc + 0;
            }, 0);
            console.log("index: ", index);
            const selectSql = `MAX(SUBSTRING(code, ${index + 1}, ${
              arrCode[i + 1]?.length
            })) AS maxlevel`;
            console.log("selectSql: ", selectSql);
            const maxOfLevel = "9".repeat(arrCode[i + 1]?.length || 1);
            console.log("maxOfLevel: ", maxOfLevel);
            const whereSqlLeft = `LEFT(code, ${index}) = ?`;
            console.log("whereSqlLeft: ", whereSqlLeft);
            const whereSqlSubStr = `SUBSTRING(code, ${index + 1}, ${
              arrCode[i + 1]?.length
            }) <> ?`;
            console.log("whereSqlSubStr: ", whereSqlSubStr);
            console.log("code.slice(0, index): ", code.slice(0, index));
            const zeroStr = "0".repeat(arrCode[i + 1]?.length || 1);
            const maxLevel = await knex("tbvt_categories")
              .select(knex.raw(selectSql))
              .whereRaw(whereSqlLeft, code.slice(0, index))
              .andWhereRaw(whereSqlSubStr, maxOfLevel)
              .andWhereRaw("type = ?", type)
              .then((result) => {
                console.log("result maxLevel: ", result);
                return result[0].maxlevel;
              });
            console.log("maxLevel: ", maxLevel);
            newCode =
              code.slice(0, index) +
              zeroStr.slice(0, zeroStr.length - String(+maxLevel + 1).length) +
              String(+maxLevel + 1);
            if (i < arrCode.length && arrLast.length > 0) {
              console.log("arrLast: ", arrLast);
              arrLast.shift();
              console.log("arrLastBefore: ", arrLast);
              const lastCode = arrLast.length > 0 ? arrLast.join(".") : "";
              console.log("lastCode: ", lastCode);
              console.log("newCode: ", newCode);
              if (lastCode !== "") {
                newCode = newCode + "." + lastCode;
              }
            }
            break;
          } else {
            if (i === 0) {
              console.log("zo day i = 0");
              const index = 1;
              // Q00.00.00.00.00.000 Level 1
              // Q01.00.00.00.00.000 Level 2
              console.log("index: ", index);
              const selectSql = `MAX(SUBSTRING(code, ${index + 1}, ${
                arrCode[i + 1]?.length
              })) AS maxlevel`;
              console.log("selectSql: ", selectSql);
              const maxOfLevel = "9".repeat(arrCode[i + 1]?.length || 1);
              console.log("maxOfLevel: ", maxOfLevel);
              const whereSqlLeft = `LEFT(code, ${index}) = ?`;
              console.log("whereSqlLeft: ", whereSqlLeft);
              const whereSqlSubStr = `SUBSTRING(code, ${index + 1}, ${
                arrCode[i + 1]?.length
              }) <> ?`;
              console.log("whereSqlSubStr: ", whereSqlSubStr);
              console.log("code.slice(0, index): ", code.slice(0, index));
              const zeroStr = "0".repeat(arrCode[i + 1]?.length || 1);
              const maxLevel = await knex("tbvt_categories")
                .select(knex.raw(selectSql))
                .whereRaw(whereSqlLeft, code.slice(0, index))
                .andWhereRaw(whereSqlSubStr, maxOfLevel)
                .andWhereRaw("type = ?", type)
                .then((result) => {
                  console.log("result maxLevel: ", result);
                  return result[0].maxlevel;
                });
              console.log("maxLevel: ", maxLevel);
              newCode =
                code.slice(0, index) +
                zeroStr.slice(
                  0,
                  zeroStr.length - String(+maxLevel + 1).length
                ) +
                String(+maxLevel + 1);
              console.log("newCode: ", newCode);
              if (i < arrCode.length && arrLast.length > 0) {
                console.log("arrLastBefore: ", arrLast);
                const lastCode = arrLast.length > 0 ? arrLast.join(".") : "";
                console.log("lastCode: ", lastCode);
                console.log("newCode: ", newCode);
                if (lastCode !== "") {
                  newCode = newCode + "." + lastCode;
                }
              }
            } else {
              arrLast.unshift(arrCode[i]);
            }

            //
          }
        }
      }
    }

    return newCode;
  } catch (error) {
    console.error("Error generating new unit code:", error);
    return "";
  }
}

// function generateNextCode(startCode: string, segmentIndex: number): string {
//   // Split the code into parts
//   const parts = startCode.split('.');

//   // Ensure the segment index is valid
//   if (segmentIndex < 0 || segmentIndex >= parts.length) {
//       throw new Error("Invalid segment index");
//   }

//   // Handle the first part if it contains a prefix (like "Q01")
//   if (segmentIndex === 0) {
//       const prefix = parts[0][0]; // Extract the prefix (e.g., "Q")
//       const numericPart = parseInt(parts[0].slice(1), 10); // Extract the numeric part
//       const incrementedPart = (numericPart + 1).toString().padStart(2, '0'); // Increment and pad
//       parts[0] = `${prefix}${incrementedPart}`;
//   } else {
//       // For other segments, simply parse, increment, and pad
//       const numericPart = parseInt(parts[segmentIndex], 10);
//       const incrementedPart = (numericPart + 1).toString().padStart(2, '0');
//       parts[segmentIndex] = incrementedPart;
//   }

//   // Reassemble and return the updated code
//   return parts.join('.');
// }
