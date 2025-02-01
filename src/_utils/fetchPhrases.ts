export default async function fetchPhrases(queryParams?: { [key: string]: string }) {
    const query = new URLSearchParams(queryParams).toString();

    const response = await fetch('http://localhost:3000/api/fetch-phrases?' + query);
    console.log(response)
    const { phrases } = await response.json();

    return phrases;
}