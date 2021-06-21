import express from "express"
import fs from "fs/promises"
import path from "path"

type Cell = {
  id: string
  content: string
  type: "text" | "code"
}

export const createCellsRouter = (filename:string, dir:string) => {
  const router = express.Router()
  router.use(express.json())
  const fullPath = path.join(dir, filename)
  console.log(fullPath)

  router.get("/cells", async (req,res) => {
    try {
      // Read the file
      const result = await fs.readFile(fullPath, {encoding:"utf8"})
      res.send(JSON.parse(result))
    } catch (error) {
      if(error.code === "ENOENT") {
        // Add code to create a file and add default cells
        await fs.writeFile(fullPath,"[]","utf8")
        res.send([])
      } else {
        // If read throws an error
        throw error;

      }
    }
    // Inspect the error, see if it says that the file doesn't exist
    // Parse a list of cells out of it
    // Send list of cells back to browser
  })

  router.post("/cells", async (req,res) => {
    // Take the list of cells from the request obj
    // serialize them
    const { cells }:{cells:Cell[]} = req.body
    // Write the cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells),"utf8")
    res.send({status:"ok"})
  })
  return router
}
