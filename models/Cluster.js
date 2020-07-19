const mongoose = require('mongoose')

//schema of cluster which contains many hexaland grids
const clusterSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }
})

const Cluster = mongoose.model('Cluster', clusterSchema)

module.exports = Cluster