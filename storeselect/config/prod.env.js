if(process.argv[2]){
    module.exports = {
      NODE_ENV: '"'+(process.argv[2]?process.argv[2]:'production')+'"'
    }
}else{
    module.exports = {
        NODE_ENV: '"production"'
    }
}

