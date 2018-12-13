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
    static int numOfActors = 30;
    static int actorsLength = 2; // The number of different actors
    static int tilesLength = 5; // The number of different tiles
    static private String path = "testWorld30+15*60.json";


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
        int maxThing = getThing(tilesLength);

        for(int i=0; i<mapHeight; i++) {
            for(int j=0; j<mapWidth; j++) {
                double rand = Math.random() * maxThing;

                boolean finished = false;
                for(int k=0; k<tilesLength && !finished; k++) {
                    rand -= k;
                    if(rand <= 0) {
                        finished = true;
                        level[i][j] = k;
                    }
                }
            }
        }

        return level;
    }

    public static Actor[] buildActors() {
        Actor[] actors = new Actor[numOfActors];
        Random rand = new Random();

        for(int i=0; i<numOfActors; i++) {
            int x = rand.nextInt(worldWidthPx);
            int y = rand.nextInt(worldHeightPx);
            int name = rand.nextInt(actorsLength);
            int[] pos = new int[2];
            pos[0] = x;
            pos[1] = y;
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


    public static int getThing(int e) {
        return getThing(e, 0);
    }

    public static int getThing(int e, int sum) {
        if(e <= 0) {
            return sum;
        }
        else {
            sum += e;
            return getThing(e-1, sum);
        }
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

        System.out.println("RESULTS OF RANDOMNESS:\n\ttotal:" + Integer.toString(total));
        for(int i=0; i<results.length; i++) {
            System.out.println("\tresult " + Integer.toString(i) + ": " + Integer.toString(results[i]));
        }
    }




}
