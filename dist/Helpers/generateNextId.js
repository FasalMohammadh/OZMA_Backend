function generateNextId(prefix, id) {
    let numberPart = Number(id.slice(prefix.length));
    numberPart = numberPart + 1;
    return `${prefix}${numberPart.toString().padStart(4, '0')}`;
}
export default generateNextId;
