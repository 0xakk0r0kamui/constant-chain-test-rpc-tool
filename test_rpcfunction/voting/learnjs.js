x = ['a b c','d','e']
for (i in x) {
    console.log(i)
    x[i] = x[i].split(' ')
}

console.log(x)
