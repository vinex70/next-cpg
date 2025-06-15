
const getDays = () => {
    const today = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const date = `${pad(today.getDate())}${pad(today.getMonth() + 1)}${today.getFullYear()}`;
    return date
}

export default getDays
