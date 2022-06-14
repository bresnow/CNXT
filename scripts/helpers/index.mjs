export async function getImageAndVersion() {
    let pkg = JSON.parse(await read('package.json'))
    let status = await $`git status`.pipe($`grep "On branch"`)
    let branch = status.stdout.replace("On branch ", "").trim()
    let image = pkg.name + "-" + branch, version = pkg.version
    return { image, version }
}