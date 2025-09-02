// const fetch = require("node-fetch");
const fetch = require('node-fetch').default;

exports.loadTest = async (req, res) => {
    const fileId = req.body.fileId;
    const userId = req.userDetails.id;
    
    const concurrentJobs = 5;
    const jobRequests = [];

    for (let i = 0; i < concurrentJobs; i++) {
        jobRequests.push(
            // change this to ec2 address 
            fetch("http://localhost:3000/transcode/transcode_load_test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  
                    fileId: fileId,
                    userIdLoadTest: userId,
                    transcodeType: "webm"
                })
            })
            .then(res => res.json())
            .then(data => console.log(`Job ${i+1} started`, data))
            .catch(err => console.error(`Job ${i+1} failed`, err))
        )
    }

    // Promise.all(jobRequests).then(() => {
    //     console.log("Load test triggered");
    //     return res.status(200).json({ message: "Load test complete" });
    // })

    try {
        await Promise.all(jobRequests);
        console.log("Load test triggered");
        return res.status(200).json({ message: "Load test completed" });
    } catch (error) {
        console.error("Load test failed: ", error);
        return res.status(500).json({ message: "load test failed" });
    }
}