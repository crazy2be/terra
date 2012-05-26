using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Threading;
using System.Runtime.Serialization.Formatters.Binary;
using System.IO;
using Newtonsoft.Json;

namespace RiskMapMaker
{
    public partial class BoardCreator : Form
    {
        public BoardCreator()
        {
            InitializeComponent();

            foreach (Control control in Controls)
            {
                control.KeyDown += new KeyEventHandler(Anything_KeyDown);
                control.MouseMove += new MouseEventHandler(control_MouseMove);
            }

            Shown += new EventHandler(BoardCreator_Shown);
            Load += new EventHandler(BoardCreator_Load);
        }

        void BoardCreator_Load(object sender, EventArgs e)
        {
            BringToFront();
        }

        void BoardCreator_Shown(object sender, EventArgs e)
        {
           BringToFront();            
        }

        [Serializable]
        class Country
        {
            public List<PointF> polyPoints = new List<PointF>();
            
            [JsonPropertyAttribute(DefaultValueHandling = DefaultValueHandling.Ignore)]
            public List<Country> countriesConnected = new List<Country>();
            
            /// <summary>
            /// This is filled in by draw, it does not neccessarily correspond with continents, 
            /// so you have to always do a search!
            /// </summary>
            public int continentNumber = -1;

            /// <summary>
            /// Just temporary, don't use.
            /// </summary>
            public int tempNumber = -1;

            /// <summary>
            /// Set after it is fully made, and only then! (likely)
            /// </summary>
            [JsonPropertyAttribute(DefaultValueHandling = DefaultValueHandling.Ignore)]
            public PointF centerPoint;
            
            public bool IsIn(PointF point)
            {
                //First decompose poly to triangles and then check from there.
                //This is not perfect as our decomposition will not be perfect, but its good enough for this!

                //We just go through the polyPoints, instead of really creating the triangles
                for (int x = 1; x < polyPoints.Count - 1; x++)                
                    if (PointInTriangle(point, polyPoints[0], polyPoints[x], polyPoints[x + 1]))
                        return true;

                return false;
            }

            //Copied from http://www.blackpawn.com/texts/pointinpoly/default.html 
            private static bool SameSide(PointF p1, PointF p2, PointF a, PointF b)
            {
                double cp1 = CrossProduct(Sub(b, a), Sub(p1, a));
                double cp2 = CrossProduct(Sub(b, a), Sub(p2, a));
                return (cp1 * cp2 > 0);
            }

            private static bool PointInTriangle(PointF p, PointF a, PointF b, PointF c)
            {
                return (SameSide(p,a, b,c) && SameSide(p,b, a,c) && SameSide(p,c,a,b));        
            }

            public static double CrossProduct(PointF p1, PointF p2)
            {
                return p1.X * p2.Y - p1.Y * p2.X;
            }

            public static double DotProduct(PointF p1, PointF p2)
            {
                return p1.X * p2.X + p1.Y * p2.Y;
            }

            public static PointF Sub(PointF p1, PointF p2)
            {
                return new PointF(p1.X - p2.X, p1.Y - p2.Y);
            }

            public static PointF Add(PointF p1, PointF p2)
            {
                return new PointF(p1.X + p2.X, p1.Y + p2.Y);
            }

            public static PointF Mult(PointF p, float number)
            {
                return new PointF(p.X * number, p.Y * number);
            }

            public double Area()
            {
                double area = 0;

                int i;
                for (i = 0; i < polyPoints.Count - 1; i++)                
                    area += (polyPoints[i].X * polyPoints[i + 1].Y - polyPoints[i + 1].X * polyPoints[i].Y);
                area += (polyPoints[i].X * polyPoints[0].Y - polyPoints[0].X * polyPoints[i].Y);
                area *= 0.5;

                return area;
            }

            //http://en.wikipedia.org/wiki/Centroid
            public PointF Centroid()
            {
                double area = Area();

                double Cx = 0;
                int i;
                for (i = 0; i < polyPoints.Count - 1; i++)
                {
                    Cx += (polyPoints[i].X + polyPoints[i + 1].X) *
                        ((polyPoints[i].X * polyPoints[i + 1].Y) - (polyPoints[i + 1].X * polyPoints[i].Y));
                }

                Cx += (polyPoints[i].X + polyPoints[0].X) *
                        ((polyPoints[i].X * polyPoints[0].Y) - (polyPoints[0].X * polyPoints[i].Y));

                Cx *= (1.0 / 6.0) / area;                

                double Cy = 0;
                for (i = 0; i < polyPoints.Count - 1; i++)
                {
                    Cy += (polyPoints[i].Y + polyPoints[i + 1].Y) *
                        ((polyPoints[i].X * polyPoints[i + 1].Y) - (polyPoints[i + 1].X * polyPoints[i].Y));
                }
                Cy += (polyPoints[i].Y + polyPoints[0].Y) *
                        ((polyPoints[i].X * polyPoints[0].Y) - (polyPoints[0].X * polyPoints[i].Y));

                Cy *= (1.0 / 6.0) / area;

                return new PointF((float)Cx, (float)Cy);
            }

            public override string ToString()
            {
                return centerPoint.ToString() + " cont num: " + continentNumber.ToString();
            }
        }

        List<List<Country>> continents = new List<List<Country>>();
        List<Country> FindContinent(Country country)
        {
            bool selectedFound = false;
            List<Country> curContinent = null;
            foreach (List<Country> continent in continents)
            {
                foreach (Country contCountry in continent)
                    if (contCountry == country)
                    {
                        if (selectedFound) //REALLY REALLY BAD!
                            throw new Exception("Country found twice in continent data");

                        selectedFound = true;
                        curContinent = continent;                        
                    }                
            }
            
            return curContinent;            
        }

        Country CurrentlyMousedOver()
        {
            foreach (Country country in countries)
                if (country.IsIn(lastMousePosition))
                {
                    return country;                    
                }
            return null;
        }

        States stateCur = States.Selecting;
        enum States { Selecting, Connections, Continents };

        List<Country> countries = new List<Country>();
        Country countryCur = new Country();

        PointF lastMousePosition;


        //List<Country> countriesSelected = new List<Country>();
        Country countrySelected = null;
        Country lastSelected = null;

        //Sort of hackish to make removing connections possible
        List<Country> countriesWithConnectionsAdded = new List<Country>();

        //stateCur dependent
        private void pictureBox1_Click(object sender, EventArgs e)
        {
            MouseEventArgs mouseEvent = (MouseEventArgs)e;
            PointF pointCur = new PointF(mouseEvent.X, mouseEvent.Y);

            if (stateCur == States.Selecting)
            {
                countryCur.polyPoints.Add(pointCur);
            }
            else if (stateCur == States.Connections)
            {
                lastSelected = countrySelected;
                countrySelected = null;

                //Look through countries to find the one selected
                countrySelected = CurrentlyMousedOver();             
            }
            else if (stateCur == States.Continents)
                //Make new continent grouping with it, if it does not already have one
            {
                //Look through countries to find the one selected
                countrySelected = CurrentlyMousedOver();                

                if (countrySelected != null)
                {                    
                    List<Country> curContinent = FindContinent(countrySelected);

                    if (curContinent == null)
                    {
                        curContinent = new List<Country>();
                        curContinent.Add(countrySelected);
                        continents.Add(curContinent);
                    }
                }
            }

            Refresh();
        }

        //stateCur dependent
        private void Add_Click(object sender, EventArgs e)
        {
            if (stateCur == States.Selecting)
            {
                //Fix up some stuff with countryCur

                //Find countryCur center
                if (countryCur.polyPoints.Count > 2)
                {
                    countryCur.centerPoint = countryCur.Centroid();

                    countries.Add(countryCur);
                }

                countryCur = new Country();
            }
            else if (stateCur == States.Connections)
            {
                if (countrySelected != null)
                {
                    Country curMousedOver = CurrentlyMousedOver();     
                    
                    if (!curMousedOver.countriesConnected.Contains(countrySelected))
                    {
                        countrySelected.countriesConnected.Add(curMousedOver);
                        curMousedOver.countriesConnected.Add(countrySelected);                        
                    }
                    //Move it to back
                    if(countriesWithConnectionsAdded.Contains(countrySelected))
                        countriesWithConnectionsAdded.Remove(countrySelected);
                    countriesWithConnectionsAdded.Add(countrySelected);
                }
            }
                //Remove from existing group and add to new
            else if (stateCur == States.Continents)
            {
                Country curMousedOver = CurrentlyMousedOver();
                if (countrySelected != null && curMousedOver != null)
                {
                    //Find the continent of the country currently selected
                    List<Country> newContinent = FindContinent(countrySelected);
                    List<Country> oldContinent = FindContinent(curMousedOver);

                    //If the continents are the same, this will still work fine
                    if (newContinent != null)
                    {
                        if (oldContinent != null && oldContinent.Contains(curMousedOver))
                            oldContinent.Remove(curMousedOver);

                        newContinent.Add(curMousedOver);                        
                    }
                }
            }

            Refresh();
        }

        //stateCur dependent
        private void ClearCurrent_Click(object sender, EventArgs e)
        {
            if (stateCur == States.Selecting)
            {
                countryCur = new Country();
            }
            else if (stateCur == States.Connections)
            {
                countrySelected = null;
                countries.Remove(countrySelected);
            }
            else if (stateCur == States.Continents)
            {
                continents.Clear();
            }
            Refresh();
        }

        //stateCur dependent
        private void ClearLast_Click(object sender, EventArgs e)
        {
            if (stateCur == States.Selecting)
            {
                if (countryCur.polyPoints.Count > 0)
                    countryCur.polyPoints.RemoveAt(countryCur.polyPoints.Count - 1);
            }
            else if (stateCur == States.Connections)
            {
                //Sort of hacking, but meh..
                if (countriesWithConnectionsAdded.Count > 0)
                {
                    Country countryToRemove = countriesWithConnectionsAdded[countriesWithConnectionsAdded.Count - 1];

                    for (int x = countryToRemove.countriesConnected.Count - 1; x >= 0; x--)
                    {
                        Country other = countryToRemove.countriesConnected[x];
                        countryToRemove.countriesConnected.Remove(other);
                        other.countriesConnected.Remove(countryToRemove);
                    }
                }
            }
            Refresh();
        }

        private void Anything_KeyDown(object sender, KeyEventArgs e)
        {            
            switch (e.KeyData)
            {                
                case Keys.OemSemicolon:
                    LoadLastSave_Click(null, null);
                    break;
            }
            Refresh();
        }

        Color[] colors = { Color.Red, Color.Orange, Color.Yellow, Color.Green, Color.Blue, Color.Indigo, Color.Violet };

        Font font = new Font(new FontFamily("Arial"), 12);
        private void pictureBox1_Paint(object sender, PaintEventArgs e)
        {
            //Recalc all continent numbers            

            foreach (Country country in countries)
                country.continentNumber = -1;

            for (int x = 0; x < continents.Count; x++)
            {
                for (int y = 0; y < continents[x].Count; y++)
                {
                    continents[x][y].continentNumber = x;
                }
            }

            //Country areas
            for (int x = 0; x < countries.Count; x++)
            {
                Color color = colors[x % colors.Length];

                if (countries[x] == countrySelected)
                    e.Graphics.FillPolygon(Brushes.White, countries[x].polyPoints.ToArray());
                else
                    e.Graphics.FillPolygon(new SolidBrush(Color.FromArgb(150, color)), countries[x].polyPoints.ToArray());

                PointF[] box = new PointF[4];
                box[0] = Country.Sub(countries[x].centerPoint, new PointF(10, 10));
                box[1] = Country.Sub(countries[x].centerPoint, new PointF(-10, 10));
                box[2] = Country.Sub(countries[x].centerPoint, new PointF(-10, -10));
                box[3] = Country.Sub(countries[x].centerPoint, new PointF(10, -10));

                e.Graphics.FillPolygon(new SolidBrush(Color.FromArgb(100, Color.WhiteSmoke)), box);

                if (countries[x].continentNumber >= 0)
                {
                    e.Graphics.DrawString(countries[x].continentNumber.ToString(), font, new SolidBrush(Color.FromArgb(200, Color.Azure)),
                        Country.Sub(countries[x].centerPoint, new PointF(20, 20)));
                }
            }
            //Country connections
            for (int x = 0; x < countries.Count; x++)
            {
                Color color = colors[x % colors.Length];

                Pen connectedPen = new Pen(Color.FromArgb(200, Color.Firebrick), 5);
                connectedPen.EndCap = System.Drawing.Drawing2D.LineCap.ArrowAnchor;
                connectedPen.DashStyle = System.Drawing.Drawing2D.DashStyle.Dash;

                foreach (Country connected in countries[x].countriesConnected)
                {
                    PointF direction = Country.Sub(countries[x].centerPoint, connected.centerPoint);

                    PointF off = Country.Mult(direction, (float)(1.0 / (Math.Sqrt(direction.X * direction.X + direction.Y * direction.Y))));
                    off = Country.Mult(off, 15);

                    e.Graphics.DrawLine(connectedPen, Country.Add(off, connected.centerPoint), countries[x].centerPoint);
                }
            }

            //Currently creating country
            //Don't do last line, color last (current) specially (and the last point is not a line)
            for (int x = 0; x < countryCur.polyPoints.Count - 1; x++)
            {
                e.Graphics.DrawLine(new Pen(Color.Olive, 2), countryCur.polyPoints[x], countryCur.polyPoints[x + 1]);
            }
            //last part
            if (stateCur == States.Selecting)
            {
                if (countryCur.polyPoints.Count > 0)
                    e.Graphics.DrawLine(new Pen(Color.OrangeRed, 2),
                        countryCur.polyPoints[countryCur.polyPoints.Count - 1],
                        lastMousePosition);
            }
        }

        void control_MouseMove(object sender, MouseEventArgs e)
        {
            lastMousePosition = new PointF(e.X, e.Y);

            Refresh();
        }

        private void createCountries_CheckedChanged(object sender, EventArgs e)
        {
            if (createCountries.Checked)
            {
                stateCur = States.Selecting;

                countrySelected = null;

                //Auto-save
                Autosave();
            }
            else
            {
                countryCur = new Country();
            }

            Refresh();
        }
        
        private void createConnections_CheckedChanged(object sender, EventArgs e)
        {
            if (createConnections.Checked)
            {
                stateCur = States.Connections;

                countrySelected = null;

                //Auto-save
                Autosave();
            }

            Refresh();
        }

        private void SelectContinents_CheckedChanged(object sender, EventArgs e)
        {
            if (SelectContinents.Checked)
            {
                stateCur = States.Continents;

                countrySelected = null;

                Autosave();
            }

            Refresh();
        }

        private void Autosave()
        {                        
            /*
            try
            {
                BinaryFormatter formatter = new BinaryFormatter();
                Stream writeSteam = File.Create("autosaved.riskmap");
                formatter.Serialize(writeSteam, countries);
                writeSteam.Close();
            }
            catch { }
            */
        }

        private void Save_Click(object sender, EventArgs e)
        {
            try
            {
                //We just save countries
                BinaryFormatter formatter = new BinaryFormatter();

                SaveFileDialog fileDialog = new SaveFileDialog();
                fileDialog.InitialDirectory = Directory.GetCurrentDirectory();
                fileDialog.DefaultExt = ".riskmap";
                DialogResult result = fileDialog.ShowDialog();

                if (result == DialogResult.OK)
                {
                    Stream writeSteam = fileDialog.OpenFile();

                    formatter.Serialize(writeSteam, countries);

                    writeSteam.Close();
                }
            }
            catch (Exception error)
            {                
                MessageBox.Show("Could not save as error occured: " + error.ToString());
            }

            Refresh();
        }

        private void Load_Click(object sender, EventArgs e)
        {
            try
            {
                OpenFileDialog fileDialog = new OpenFileDialog();
                fileDialog.InitialDirectory = Directory.GetCurrentDirectory();
                fileDialog.DefaultExt = ".riskmap";                
                DialogResult result = fileDialog.ShowDialog();

                if (result == DialogResult.OK)
                {
                    Stream readStream = fileDialog.OpenFile();

                    LoadFromStream(readStream);

                    readStream.Close();
                }
            }
            catch (Exception error)
            {
                MessageBox.Show("Could not load as error occured: " + error.ToString());
            }

            Refresh();
        }

        private void LoadLastSave_Click(object sender, EventArgs e)
        {
            int x;

            //We just save countries
            List<string> curFiles = new List<string>(Directory.GetFiles(Directory.GetCurrentDirectory()));
            for (x = curFiles.Count - 1; x >= 0; x--)
                if (!curFiles[x].EndsWith(".riskmap"))
                    curFiles.RemoveAt(x);

            curFiles.Sort((f1, f2) => File.GetLastWriteTime(f2).Ticks.CompareTo(File.GetLastWriteTime(f1).Ticks));

            //Just try all the files, breaking on success
            for (x = 0; x < curFiles.Count; x++ )
                try
                {
                    Stream readStream = File.OpenRead(curFiles[x]);

                    LoadFromStream(readStream);

                    readStream.Close();
                    break;
                }
                catch (Exception error)
                {                    
                    //MessageBox.Show("Could not load as error occured: " + error.ToString());
                }

            if(x == curFiles.Count)
                MessageBox.Show("Could not find any loadable files out of " + curFiles.Count + " tried.");

            Refresh();
        }


        private void Export_Click(object sender, EventArgs e)
        {
            HtmlSerialize(countries);

            Refresh();
        }

        private string HtmlSerialize(List<Country> countries)
        {            
            //Clipboard.SetText()

            StringBuilder outputHtml = new StringBuilder();

            for(int x = 0; x < countries.Count; x++)
            {
                //Id
                outputHtml.Append("<area class='territory' shape='poly' id=" + x.ToString());                
                outputHtml.AppendLine();
                outputHtml.AppendLine();

                //Events
                outputHtml.AppendLine("onclick='territoryClicked(id)'");
                outputHtml.AppendLine("onmouseover='territoryMousedOver(id, "
                    +countries[x].centerPoint.X.ToString()+","
                    +countries[x].centerPoint.Y.ToString()+")'");
                outputHtml.AppendLine("onmouseout='territoryMouseOut(id, "
                    + countries[x].centerPoint.X.ToString() + ","
                    + countries[x].centerPoint.Y.ToString() + ")'");
                outputHtml.AppendLine();

                //Coords
                outputHtml.Append("coords='");
                //string temp = "";
                for (int y = 0; y < countries[x].polyPoints.Count; y++)
                {
                    outputHtml.Append((int)countries[x].polyPoints[y].X);
                    outputHtml.Append(",");
                    outputHtml.Append((int)countries[x].polyPoints[y].Y);
                    outputHtml.Append(",");


                    //temp += "x" + (y + 1).ToString() + ": " + (int)countries[x].polyPoints[y].X;
                    //temp += ",   " + "y" + (y + 1).ToString() + ": " + (int)countries[x].polyPoints[y].Y + ", \n";                    
                }

                outputHtml.AppendLine("'/>");
                outputHtml.AppendLine();
                outputHtml.AppendLine();
            }
            

            Clipboard.SetText(outputHtml.ToString());

            return outputHtml.ToString();
        }

        private string JSONSerialize(List<Country> countries)
        {
            StringBuilder outputJSON = new StringBuilder();

            outputJSON.AppendLine("{");

            //start territories
            outputJSON.AppendLine("\"Territories\": [");


            for (int x = 0; x < countries.Count; x++)            
                countries[x].tempNumber = x;
            
            for (int x = 0; x < countries.Count; x++)            
            {                
                //Start connections and territory
                outputJSON.Append("\t{\"Connections\": [");

                int y;
                for (y = 0; y < countries[x].countriesConnected.Count - 1; y++)               
                    outputJSON.Append(countries[x].countriesConnected[y].tempNumber + ", ");
                outputJSON.Append(countries[x].countriesConnected[y].tempNumber);

                //End connections
                outputJSON.AppendLine("],");

                if (countries[x].continentNumber < 0)
                    MessageBox.Show("invalid continent data");

                //Continent
                outputJSON.Append("\t   \"Continent\": " + countries[x].continentNumber);

                //end territory
                outputJSON.AppendLine("\t}");
            }

            //end territories
            outputJSON.AppendLine("],");

            //Hardcoded bonuses
            outputJSON.AppendLine("\"Continents\": [");
            outputJSON.AppendLine("\t{\"Bonus\": 1},");
            outputJSON.AppendLine("\t{\"Bonus\": 3}");            
            outputJSON.AppendLine("]");

            outputJSON.AppendLine("}");            

            Clipboard.SetText(outputJSON.ToString());
            return outputJSON.ToString();
        }

        private void LoadFromStream (Stream stream)
        {
            BinaryFormatter formatter = new BinaryFormatter();
            //Clear all non loadable attributes
            countriesWithConnectionsAdded.Clear();
            countryCur = new Country();
            countrySelected = null;
            lastSelected = null;

            countries = (List<Country>)formatter.Deserialize(stream);

            //Recalc continents            
            continents = new List<List<Country>>();

            foreach (Country country in countries)
            {
                if(country.continentNumber == -1)
                    continue;

                List<Country> curContinent = null; //Will be set
                
                //The last one will be found, so overlaps will not be detected
                foreach (List<Country> continent in continents)                
                    foreach (Country contCountry in continent)
                        if (contCountry.continentNumber == country.continentNumber)                        
                            curContinent = continent;                         
                                           
                if (curContinent == null)
                {
                    curContinent = new List<Country>();
                    continents.Add(curContinent);
                }

                curContinent.Add(country);

                if (country.countriesConnected.Contains(country))
                    country.countriesConnected.Remove(country);
            }
        }

        private void exportToJSON_Click(object sender, EventArgs e)
        {
            JSONSerialize(countries);
        }


    }
}