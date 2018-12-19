import java.io.FileWriter;
import java.io.PrintWriter;
import java.io.IOException;
import java.io.Writer;
import java.io.BufferedWriter;
import java.io.OutputStreamWriter;
import java.io.FileOutputStream;
import java.util.Random;

public class RandomMapCreator {

    static int mapWidth = 15;
    static int mapHeight = 60;
    static int tileWidth = 96;
    static int tileHeight = 52;
    static int worldWidthPx = mapWidth * tileWidth;
    static int worldHeightPx = mapHeight * tileHeight / 2;
    static int numOfActors = 50;
    static double[] tilePercentages = new double[] {0.5, 0.3, 0.1, 0.08, 0.02};
    static double[] actorPercentages = new double[] {0.25, 0.25, 0.25, 0.25};
    static int[][] actorCenterPositions = new int[][] {
            {worldWidthPx/3, worldHeightPx/3},
            {2*worldWidthPx/3, worldHeightPx/3},
            {worldWidthPx/3, 2*worldHeightPx/3},
            {2*worldWidthPx/3, 2*worldHeightPx/3}
    };
    static int actorsLength = 4; // The number of different actors
    static int tilesLength = 5; // The number of different tiles
    static private String path = "finalWorld.json";


    public static void main(String[] args) {

        Writer writer = null;
        try {
            writer = new BufferedWriter(new OutputStreamWriter(
                    new FileOutputStream(path), "utf-8"));

            int[][] level = buildTiles();
            Actor[] actors = buildActors();

            testRandomness(level);

            String data = "{\n\"tiles\":\n" + levelToString(level) + "\"actors\":\n" + actorsToString(actors) + "\n}";
            writer.write(data);


        } catch (Exception e) {
            System.out.println(e);
        } finally {
            try {writer.close();} catch (Exception ex) {System.out.println(ex);}
        }
    }

    public static int[][] buildTiles() {
        int[][] level = new int[mapHeight][mapWidth];
        if(!setPercentages(tilePercentages))
            System.out.println("Problem with the tilePercentages array (doesn't add to 1)");

        for(int i=0; i<mapHeight; i++) {
            for(int j=0; j<mapWidth; j++) {
                double rand = Math.random();
                int tile = 0;
                while(tilePercentages[tile] < rand)
                    tile++;
                level[i][j] = tile;
            }
        }

        return level;
    }

    public static Actor[] buildActors() {
        Actor[] actors = new Actor[numOfActors];
        Random rand = new Random();
        if(!setPercentages(actorPercentages))
            System.out.println("Problem with the actorPercentages array (doesn't add to 1)");


        // Set up nodes for the actors to spawn around


        for(int i=0; i<numOfActors; i++) {
            int x = rand.nextInt(2*worldWidthPx/3-10) + 5 - worldWidthPx/3;
            int y = rand.nextInt(2*worldHeightPx/3-10) + 5 - worldHeightPx/3;
            double randDouble = Math.random();
            int name = 0;
            while(actorPercentages[name] < randDouble)
                name++;
            int[] pos = new int[2];
            pos[0] = x + actorCenterPositions[name][0];
            pos[1] = y + actorCenterPositions[name][1];
            actors[i] = new Actor(pos, name);
        }

        return actors;
    }

    public static String levelToString(int[][] level) {
        String out = "[";
        for(int i=0; i<level.length; i++) {
            out += "[";
            for(int j=0; j<level[i].length; j++) {
                out += Integer.toString(level[i][j]) + ",";
            }
            out = out.substring(0, out.length()-1);
            out += "],\n";
        }
        out = out.substring(0, out.length()-1);
        out = out.substring(0, out.length()-1);
        out += "],\n\n";

        return out;
    }

    public static String actorsToString(Actor[] actors) {
        String out = "[";

        for(int i=0; i<actors.length; i++) {
            out += "{";
            out += "\"name\": " + Integer.toString(actors[i].getName());
            int[] pos = actors[i].getPosition();
            out += ", \"position\": [";
            for(int j=0; j<pos.length; j++) {
                out += Integer.toString(pos[j]) + ",";
            }
            out = out.substring(0, out.length()-1);
            out += "]},\n";
        }

        out = out.substring(0, out.length()-1);
        out = out.substring(0, out.length()-1);
        out += "]";

        return out;
    }

    public static boolean setPercentages(double[] percentages) {
        double sum = 0.0;
        for(int i=0; i<percentages.length; i++) {
            sum += percentages[i];
            percentages[i] = sum;
        }
        if(sum == 1.0) {
            return true;
        }
        return false;
    }

    public static void testRandomness(int[][] level) {
        int total = 0;

        int[] results = new int[tilesLength];
        for(int i=0; i<results.length; i++) {
            results[i] = 0;
        }

        for(int i=0; i<level.length; i++) {
            for(int j=0; j<level[i].length; j++) {
                results[level[i][j]]++;
                total++;
            }
        }

        System.out.println("RESULTS OF RANDOMNESS:\n\ttotal: " + Integer.toString(total));
        for(int i=0; i<results.length; i++) {
            System.out.println("\tresult " + Integer.toString(i) + ": " + Integer.toString(results[i]));
        }
    }

}
