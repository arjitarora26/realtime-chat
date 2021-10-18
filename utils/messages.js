function formatMessage(username, text) {
    return {
        username,
        text,
        time: new Date().getTime(),
    }
}

function cleanInput(msg) {
    return msg.replace(/[&<>'"]/g, 
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag]));
}

module.exports = {
    formatMessage,
    cleanInput
} 