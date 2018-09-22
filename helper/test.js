const path = require('path')
const fs = require('fs')
const util = {}
/**
 * 检查路径是否存在 如果不存在则创建路径
 * @param {string} folderpath 文件路径
 */
util.checkDirExist = (folderpath) => {
    const pathArr = folderpath.split('/')
    let _path = ''
    for (let i = 0 ;i < pathArr.length; i++) {
        if (pathArr[i]) {

            _path += `/${pathArr[i]}`
            if (!fs.existsSync(_path)) {

                fs.mkdirSync(_path)
            }

        }
    }
}
// let tempPath = "static/avatar/avatar"
let tempPath = "static/"
const pathArr = tempPath.split('/')
console.log(pathArr)

console.log(fs.existsSync(tempPath))
if(!fs.existsSync(tempPath)) {
    console.log(
        fs.mkdirSync(tempPath)
    )

}




// util.checkDirExist()