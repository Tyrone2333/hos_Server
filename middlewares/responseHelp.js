/**
 * Created by 杨志清 on 2019/5/18.
 */
export default function (req, res, next) {
    res.success = function (data = {}, message = "ok", errno = 0) {
        res.send({
            errno,
            data: data,
            message,
        })
    }
    res.error = function (data = {}, message = "error", errno = 500) {
        res.send({
            errno,
            data: data,
            message,
        })
    }
    next()
}
