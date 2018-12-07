public class Actor {

    int[] position;
    int name;


    Actor(int[] position, int name) {
        this.position = position;
        this.name = name;
    }

    public int[] getPosition() {
        return position;
    }

    public int getName() {
        return name;
    }
}
