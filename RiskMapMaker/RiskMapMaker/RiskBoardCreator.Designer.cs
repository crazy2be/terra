using System.Windows.Forms;
namespace RiskMapMaker
{
    partial class BoardCreator
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(BoardCreator));
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.Add = new System.Windows.Forms.Button();
            this.ClearCurrent = new System.Windows.Forms.Button();
            this.Export = new System.Windows.Forms.Button();
            this.ClearLast = new System.Windows.Forms.Button();
            this.createCountries = new System.Windows.Forms.RadioButton();
            this.createConnections = new System.Windows.Forms.RadioButton();
            this.Save = new System.Windows.Forms.Button();
            this.LoadData = new System.Windows.Forms.Button();
            this.LoadLastSave = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.SuspendLayout();
            // 
            // pictureBox1
            // 
            this.pictureBox1.BackColor = System.Drawing.SystemColors.ButtonShadow;
            this.pictureBox1.Image = global::RiskMapMaker.Properties.Resources.riskmap_en_small;
            this.pictureBox1.InitialImage = ((System.Drawing.Image)(resources.GetObject("pictureBox1.InitialImage")));
            this.pictureBox1.Location = new System.Drawing.Point(12, 12);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(850, 650);
            this.pictureBox1.TabIndex = 0;
            this.pictureBox1.TabStop = false;
            this.pictureBox1.Click += new System.EventHandler(this.pictureBox1_Click);
            this.pictureBox1.Paint += new System.Windows.Forms.PaintEventHandler(this.pictureBox1_Paint);
            // 
            // Add
            // 
            this.Add.Location = new System.Drawing.Point(12, 669);
            this.Add.Name = "Add";
            this.Add.Size = new System.Drawing.Size(137, 23);
            this.Add.TabIndex = 1;
            this.Add.Text = "Add (a)";
            this.Add.UseVisualStyleBackColor = true;
            this.Add.Click += new System.EventHandler(this.Add_Click);
            // 
            // ClearCurrent
            // 
            this.ClearCurrent.Location = new System.Drawing.Point(155, 669);
            this.ClearCurrent.Name = "ClearCurrent";
            this.ClearCurrent.Size = new System.Drawing.Size(137, 23);
            this.ClearCurrent.TabIndex = 2;
            this.ClearCurrent.Text = "Clear Current (c)";
            this.ClearCurrent.UseVisualStyleBackColor = true;
            this.ClearCurrent.Click += new System.EventHandler(this.ClearCurrent_Click);
            // 
            // Export
            // 
            this.Export.Location = new System.Drawing.Point(298, 668);
            this.Export.Name = "Export";
            this.Export.Size = new System.Drawing.Size(137, 23);
            this.Export.TabIndex = 3;
            this.Export.Text = "Export Country Data (e)";
            this.Export.UseVisualStyleBackColor = true;
            this.Export.Click += new System.EventHandler(this.Export_Click);
            // 
            // ClearLast
            // 
            this.ClearLast.Location = new System.Drawing.Point(155, 698);
            this.ClearLast.Name = "ClearLast";
            this.ClearLast.Size = new System.Drawing.Size(137, 23);
            this.ClearLast.TabIndex = 4;
            this.ClearLast.Text = "Clear Last (x)";
            this.ClearLast.UseVisualStyleBackColor = true;
            this.ClearLast.Click += new System.EventHandler(this.ClearLast_Click);
            // 
            // createCountries
            // 
            this.createCountries.AutoSize = true;
            this.createCountries.Checked = true;
            this.createCountries.Location = new System.Drawing.Point(869, 13);
            this.createCountries.Name = "createCountries";
            this.createCountries.Size = new System.Drawing.Size(103, 17);
            this.createCountries.TabIndex = 5;
            this.createCountries.TabStop = true;
            this.createCountries.Text = "Create Countries";
            this.createCountries.UseVisualStyleBackColor = true;
            this.createCountries.CheckedChanged += new System.EventHandler(this.createCountries_CheckedChanged);
            // 
            // createConnections
            // 
            this.createConnections.AutoSize = true;
            this.createConnections.Location = new System.Drawing.Point(869, 37);
            this.createConnections.Name = "createConnections";
            this.createConnections.Size = new System.Drawing.Size(162, 17);
            this.createConnections.TabIndex = 6;
            this.createConnections.TabStop = true;
            this.createConnections.Text = "Choose Country Connections";
            this.createConnections.UseVisualStyleBackColor = true;
            this.createConnections.CheckedChanged += new System.EventHandler(this.createConnections_CheckedChanged);
            // 
            // Save
            // 
            this.Save.Location = new System.Drawing.Point(298, 698);
            this.Save.Name = "Save";
            this.Save.Size = new System.Drawing.Size(137, 23);
            this.Save.TabIndex = 7;
            this.Save.Text = "Save Country Data (s)";
            this.Save.UseVisualStyleBackColor = true;
            this.Save.Click += new System.EventHandler(this.Save_Click);
            // 
            // LoadData
            // 
            this.LoadData.Location = new System.Drawing.Point(298, 727);
            this.LoadData.Name = "LoadData";
            this.LoadData.Size = new System.Drawing.Size(137, 23);
            this.LoadData.TabIndex = 8;
            this.LoadData.Text = "Load Country Data (L)";
            this.LoadData.UseVisualStyleBackColor = true;
            this.LoadData.Click += new System.EventHandler(this.Load_Click);
            // 
            // LoadLastSave
            // 
            this.LoadLastSave.Location = new System.Drawing.Point(298, 756);
            this.LoadLastSave.Name = "LoadLastSave";
            this.LoadLastSave.Size = new System.Drawing.Size(137, 23);
            this.LoadLastSave.TabIndex = 9;
            this.LoadLastSave.Text = "Load Last Save (;)";
            this.LoadLastSave.UseVisualStyleBackColor = true;
            this.LoadLastSave.Click += new System.EventHandler(this.LoadLastSave_Click);
            // 
            // BoardCreator
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1048, 803);
            this.Controls.Add(this.LoadLastSave);
            this.Controls.Add(this.LoadData);
            this.Controls.Add(this.Save);
            this.Controls.Add(this.createConnections);
            this.Controls.Add(this.createCountries);
            this.Controls.Add(this.ClearLast);
            this.Controls.Add(this.Export);
            this.Controls.Add(this.ClearCurrent);
            this.Controls.Add(this.Add);
            this.Controls.Add(this.pictureBox1);
            this.Location = new System.Drawing.Point(600, 200);
            this.Name = "BoardCreator";
            this.StartPosition = System.Windows.Forms.FormStartPosition.Manual;
            this.Text = "Risk Board Creator";
            this.KeyDown += new System.Windows.Forms.KeyEventHandler(this.Anything_KeyDown);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.Button Add;
        private System.Windows.Forms.Button ClearCurrent;
        private System.Windows.Forms.Button Export;
        private Button ClearLast;
        private RadioButton createCountries;
        private RadioButton createConnections;
        private Button Save;
        private Button LoadData;
        private Button LoadLastSave;
    }
}

