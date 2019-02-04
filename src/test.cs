using System;
using System.Windows.Forms;

public class Test : Form
{
    static public void Main () {
        Application.Run(new Test());
    }

    public Test () {
        this.Text = "Hello Mono World";
    }
}