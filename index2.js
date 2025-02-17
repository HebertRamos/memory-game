const fs = require('fs');
const path = require('path');

function findDependency(jobData, jobName, level, visited = new Set()) {

    if (visited.has(jobName)) {
        return []
    }

    const jobsDependencies = jobData.filter((job) => {

        const dependciesWithJobName = job.dependencies
            .filter((dep) => {
                return dep.indexOf(jobName) !== -1;
            });

        return dependciesWithJobName.length > 0;
    })
        .map((job) => {
            return {
                job: job.job,
                level: level,
                dependencies: []
            }
        });


    if (jobsDependencies.length == 0) {
        return [];
    }

    const jobNames = jobsDependencies.map((job) => job.job);

    let result = jobsDependencies;
    jobsDependencies.forEach((job) => {

        let subDeps = findDependency(jobData, job.job, level + 1, visited);

        subDeps = subDeps
            .filter((dep) => {
                return jobNames.indexOf(dep.job) == -1;
            });

        job.dependencies = subDeps;
    });


    return result;
}

function showDependencies(filename, jobName) {
    try {
        const filePath = path.join(__dirname, filename);
        const fileData = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileData);

        const jobData = jsonData.find(job => job.job === jobName);

        if (!jobData) {
            return `Job "${jobName}" not found.`; // Or throw an error if you prefer.
        }

        const allDependencies = findDependency(jsonData, jobName, 1);

        return allDependencies;
    } catch (error) {
        return `Error: ${error.message}`; // Or throw the error.
    }
}



// Example usage:
// const dependencies = showDependencies('input.json', 'GTW');
// console.log(JSON.stringify(dependencies, null, 2)); // Use JSON.stringify for nicely formatted output.

const dependencies2 = showDependencies('input.json', 'GfEventonline');
console.log(JSON.stringify(dependencies2, null, 2));

// const dependencies3 = showDependencies('input.json', 'Summary');
// console.log(JSON.stringify(dependencies3, null, 2));

// const dependencies4 = showDependencies('input.json', 'GfEventonline');
// console.log(JSON.stringify(dependencies4, null, 2));

// const dependencies5 = showDependencies('input.json', 'NonExistentJob');
// console.log(dependencies5);
