const formatDate = (d, formatString='DD-MM-YYYY', seperator='/') => {
    const isoStr = d.toISOString()
    const extractDate = isoStr.substring(0, isoStr.indexOf('T'))
    let dateStr = ''
    const dOptions = formatString.split('-')
    const extractedDate = extractDate.split('-')
    for (let i = 0; i < dOptions.length; i += 1) {
        if (dOptions[i].toLowerCase() === 'dd') {
            const dd = extractedDate[2]
            dateStr += seperator + dd   
        }
        if (dOptions[i].toLowerCase() === 'mm') {
            const mm = extractedDate[1]
            dateStr += seperator + mm
        }
        if (dOptions[i].toLowerCase() === 'yyyy') {
            const yyyy = extractedDate[0]
            dateStr += seperator + yyyy
        }
    }
    return dateStr.substring(1)
}
module.exports = {
    formatDate
}