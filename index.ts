import express,{Express,Request,Response} from "express";
import * as fs from 'fs';
import bodyParser from "body-parser";
import cors from 'cors';

const port:number=3000;

const app: Express=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());


app.post('/submit', async (req: Request, res: Response) => {
  const name: string = req.body.Name;  // ensure case matches client
  const email: string = req.body.email;
  const phoneNum: string = req.body.phoneNum;
  const Github: string = req.body.Github;
  const elapsedTime: string = req.body.elapsedTime;
  const data = { "Name": name, "Email": email, "Phone": phoneNum, "Github": Github, "elapsedTime": elapsedTime };

  let existingData: any[] = [];
  try {
      try {
          const jsonData = await fs.promises.readFile('db.json', 'utf8');
          existingData = JSON.parse(jsonData);
      } catch (err: any) {
          if (err.code === 'ENOENT') {
              console.error('db.json file is not found, creating db.json file...');
              await fs.promises.writeFile('db.json', '[]', 'utf8');
              existingData = [];
          } else {
              console.error('Error reading existing data:', err);
              res.status(500).send({ message: 'Error accessing data storage!' });
              return;
          }
      }
      existingData.push(data);
      const newData = JSON.stringify(existingData, null, 2);
      await fs.promises.writeFile('db.json', newData, 'utf8');
      res.send({ message: 'Data submitted successfully!' });
  } catch (err) {
      console.error('Error submitting data:', err);
      res.status(500).send({ message: 'Error submitting data!' });
  }
});

app.get('/read', async (req: Request, res: Response) => {
    try {
        const jsonData = await fs.promises.readFile('db.json', 'utf8');
        const submissions = JSON.parse(jsonData);
        const id: number = Number(req.query.id);
        if(id === -2){
            //res.status(200).json(submissions.length);
            res.status(200).send(submissions.length.toString()); // Send the length as a string
            return;
        }
        else{
            if(!isNaN(id) && id>=0 && id<submissions.length){
                console.log(submissions[id]);
                res.status(200).json(submissions[id]);
            }
            else{
                res.status(500).send({message:'Index out of bound error'})
            }
            //res.send(JSON.parse(submissions[id]));
        }
        //res.status(200).json(submissions[id]);
    } catch (err) {
        console.error('Error retrieving submissions:', err);
        res.status(500).send({ message: 'Error retrieving submissions!' });
    }
});

app.get('/ping',(req: Request,res: Response)=>{
    res.send(true);
});

app.delete('/delete', async (req: Request, res: Response) => {
    const id: number = Number(req.query.id);

    try {
        const jsonData = await fs.promises.readFile('db.json', 'utf8');
        const submissions = JSON.parse(jsonData);

        if (id === -2) {
            res.status(200).json(submissions.length);
        } else if (!isNaN(id) && id >= 0 && id < submissions.length) {
            submissions.splice(id, 1); // Remove the submission at the given index
            await fs.promises.writeFile('db.json', JSON.stringify(submissions, null, 2), 'utf8');
            res.status(200).send({ message: 'Submission deleted successfully!' });
        } else {
            res.status(400).send({ message: 'Invalid submission ID!' });
        }
    } catch (err) {
        console.error('Error deleting submission:', err);
        res.status(500).send({ message: 'Error deleting submission!' });
    }
});

app.put('/editAndSave', async (req: Request, res: Response) => {
    const id: number = Number(req.query.id);

    try {
        const jsonData = await fs.promises.readFile('db.json', 'utf8');
        const submissions = JSON.parse(jsonData);

        if (!isNaN(id) && id >= 0 && id < submissions.length) {
            submissions[id] = req.body; // Update the submission at the given index
            await fs.promises.writeFile('db.json', JSON.stringify(submissions, null, 2), 'utf8');
            res.status(200).send({ message: 'Submission updated successfully!' });
        } else {
            res.status(400).send({ message: 'Invalid submission ID!' });
        }
    } catch (err) {
        console.error('Error updating submission:', err);
        res.status(500).send({ message: 'Error updating submission!' });
    }
});

app.get('/',(req: Request,res: Response)=>{
    res.send("Slidely AI Task-2");
})

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});