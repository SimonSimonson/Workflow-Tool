const initialData = {
    pieces: {
        'p1': {
            id: "p1", 
            name: "Piece 1", 
            image: "0.svg", 
            time: "1min",
            color: '#ffffff',
            additionalText: '',
            additionalDuration: '' 
        },
        'p2': { 
            id: "p2", 
            name: "Piece 2", 
            image: "1.svg", 
            time: "5min",
            color: '#ffffff',
            additionalText: '',
            additionalDuration: '' 
        },
        'p3': { 
            id: "p3", 
            name: "Piece 3", 
            image: "2.svg", 
            time: "30min", 
            color: '#ffffff',
            additionalText: '',
            additionalDuration: '' 
        },
        'p4': { 
            id: "p4", 
            name: "Piece 4", 
            image: "3.svg", 
            time: "60min",
            color: '#ffffff',
            additionalText: '',
            additionalDuration: ''  
        },
    },
    workflows: {
        'workflow-1': {id: 'workflow-1', pieceIDs: ['p3', 'p1', 'p4', 'p2','p3']}
    },
    workflowOrder: ['workflow-1'],
};
export default initialData;