using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Threading;

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

        class Country
        {
            public List<PointF> polyPoints = new List<PointF>();

            public List<Country> countriesConnected = new List<Country>();
            
            /// <summary>
            /// Set after it is fully made, and only then! (likely)
            /// </summary>
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
                return (cp1 * cp2 >= 0);
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
        }
    


        States stateCur = States.Selecting;
        enum States { Selecting, Connections };

        List<Country> countries = new List<Country>();
        Country countryCur = new Country();

        PointF lastMousePosition;


        //List<Country> countriesSelected = new List<Country>();
        Country countrySelected = null;
        Country lastSelected = null;

        //Sort of hackish to make removing connections possible
        List<Country> countriesWithConnectionsAdded = new List<Country>();

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
                foreach(Country country in countries)
                    if (country.IsIn(pointCur))
                    {
                        countrySelected = country;
                        break;
                    }                
            }

            Refresh();
        }

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
                    foreach (Country country in countries)
                        if (country.IsIn(lastMousePosition))
                        {
                            countrySelected.countriesConnected.Add(country);
                            country.countriesConnected.Add(countrySelected);
                            break;
                        }
                    //Move it to back
                    if(countriesWithConnectionsAdded.Contains(countrySelected))
                        countriesWithConnectionsAdded.Remove(countrySelected);
                    countriesWithConnectionsAdded.Add(countrySelected);
                }
            }

            Refresh();
        }

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
            Refresh();
        }

        private void Export_Click(object sender, EventArgs e)
        {
            Refresh();
        }

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
                case Keys.A: //Add
                    Add_Click(null, null);
                    break;
                case Keys.C:
                    ClearCurrent_Click(null, null);
                    break;
                case Keys.E:
                    Export_Click(null, null);
                    break;
                case Keys.X:
                    ClearLast_Click(null, null);
                    break;
                case Keys.S:
                    Save_Click(null, null);
                    break;
            }
        }

        Color[] colors = { Color.Red, Color.Orange, Color.Yellow, Color.Green, Color.Blue, Color.Indigo, Color.Violet };

        private void pictureBox1_Paint(object sender, PaintEventArgs e)
        {
            for(int x = 0; x < countries.Count; x++)
            {
                Color color = colors[x % colors.Length];
  
                if(countries[x] == countrySelected)
                    e.Graphics.FillPolygon(Brushes.White, countries[x].polyPoints.ToArray());
                else
                    e.Graphics.FillPolygon(new SolidBrush(color), countries[x].polyPoints.ToArray());       
         
                PointF[] box = new PointF[4];
                box[0] = Country.Sub(countries[x].centerPoint, new PointF(10, 10));
                box[1] = Country.Sub(countries[x].centerPoint, new PointF(-10, 10));
                box[2] = Country.Sub(countries[x].centerPoint, new PointF(-10, -10));
                box[3] = Country.Sub(countries[x].centerPoint, new PointF(10, -10));

                e.Graphics.FillPolygon(Brushes.Black, box);
            }

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
                    off = Country.Mult(off, 10);

                    e.Graphics.DrawLine(connectedPen, connected.centerPoint, Country.Add(off,countries[x].centerPoint));
                }
            }

            //Don't do last line, color last (current) specially (and the last point is not a line)
            for (int x = 0; x < countryCur.polyPoints.Count - 1; x++)
            {
                e.Graphics.DrawLine(new Pen(Color.Olive, 5), countryCur.polyPoints[x], countryCur.polyPoints[x + 1]);
            }
            
            //last part

            if (stateCur == States.Selecting)
            {
                if (countryCur.polyPoints.Count > 0)
                    e.Graphics.DrawLine(new Pen(Color.OrangeRed, 5),
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
            }
            else
            {
                countryCur = new Country();
            }
        }

        private void createConnections_CheckedChanged(object sender, EventArgs e)
        {
            if (createConnections.Checked)
            {
                stateCur = States.Connections;
            }
        }

        private void Save_Click(object sender, EventArgs e)
        {
            BinaryFormater
        }


    }
}
