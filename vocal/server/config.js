exports.config = {
        // The network to perform the action, MainNet or TestNet.
        net: 'TestNet', 
        address: process.env.VOCAL_NEO_ISSUER_ADDRESS, // ex: 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s',  // This is the address which the assets come from.
        privateKey: process.env.VOCAL_NEO_ISSUER_SECRET, // ex: '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69',
        intents: intent
};