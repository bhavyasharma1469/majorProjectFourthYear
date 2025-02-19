import axios from 'axios';

export const getJournalPublications = async () => {
    try {
        const response = await axios.get('http://localhost:5000/scrape');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { success: false, error: error.message };
    }
};
